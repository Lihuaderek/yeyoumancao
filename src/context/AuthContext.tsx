/**
 * 野有蔓草 · 用户鉴权与状态持久化上下文
 * 严格执行用户名/密码格式规则、账号持久化与安全登出机制
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { BRAND_CONFIG } from '../config';

interface AuthContextType {
  currentUser: User | null;
  register: (username: string, password: string, name?: string) => { success: boolean; message: string };
  login: (username: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  validateUsernameFormat: (username: string) => { valid: boolean; message?: string };
  validatePasswordFormat: (password: string) => { valid: boolean; message?: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // 初始化从 localStorage 读取当前登录状态
  useEffect(() => {
    try {
      const stored = localStorage.getItem(BRAND_CONFIG.localStorageKeys.currentUser);
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse current user from localStorage', e);
    }
  }, []);

  // 用户名格式校验规则
  // 1. 长度 3~20
  // 2. 仅允许字母、数字、_、-
  // 3. 不允许中文、空格、其他符号
  // 4. 必须以字母或数字开头
  const validateUsernameFormat = (username: string): { valid: boolean; message?: string } => {
    const trimmed = username.trim();
    if (trimmed !== username) {
      return { valid: false, message: '用户名需为3-20位，只能包含字母、数字、下划线或连字符，且以字母或数字开头' };
    }
    const regex = /^[a-zA-Z0-9][a-zA-Z0-9_-]{2,19}$/;
    if (!regex.test(username)) {
      return { valid: false, message: '用户名需为3-20位，只能包含字母、数字、下划线或连字符，且以字母或数字开头' };
    }
    return { valid: true };
  };

  // 密码格式校验规则
  // 1. 长度 6~20
  // 2. 不包含中文
  // 3. 不包含空格
  const validatePasswordFormat = (password: string): { valid: boolean; message?: string } => {
    if (password.length < 6 || password.length > 20) {
      return { valid: false, message: '密码需为6-20位，不能包含中文或空格' };
    }
    if (/\s/.test(password)) {
      return { valid: false, message: '密码需为6-20位，不能包含中文或空格' };
    }
    if (/[\u4e00-\u9fa5]/.test(password)) {
      return { valid: false, message: '密码需为6-20位，不能包含中文或空格' };
    }
    return { valid: true };
  };

  // 获取所有持久化注册用户列表
  const getStoredUsers = (): (User & { password?: string })[] => {
    try {
      const raw = localStorage.getItem(BRAND_CONFIG.localStorageKeys.users);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  // 注册逻辑
  const register = (rawUsername: string, rawPassword: string, name?: string) => {
    // 校验用户名格式
    const uVal = validateUsernameFormat(rawUsername);
    if (!uVal.valid) {
      return { success: false, message: uVal.message! };
    }

    // 校验密码格式
    const pVal = validatePasswordFormat(rawPassword);
    if (!pVal.valid) {
      return { success: false, message: pVal.message! };
    }

    // 统一转小写比对与存储
    const username = rawUsername.toLowerCase();
    const users = getStoredUsers();

    const exists = users.some(u => u.username.toLowerCase() === username);
    if (exists) {
      return { success: false, message: '该用户名已被注册' };
    }

    const newUser = {
      username,
      password: rawPassword,
      name: name || rawUsername,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    // 持久化保存至 yeyou_mancao_users
    localStorage.setItem(BRAND_CONFIG.localStorageKeys.users, JSON.stringify(users));

    // 注册成功后自动登录
    const userSession: User = { username, name: newUser.name, createdAt: newUser.createdAt };
    localStorage.setItem(BRAND_CONFIG.localStorageKeys.currentUser, JSON.stringify(userSession));
    setCurrentUser(userSession);

    return { success: true, message: '注册成功' };
  };

  // 登录逻辑
  const login = (rawUsername: string, rawPassword: string) => {
    const username = rawUsername.toLowerCase();
    const users = getStoredUsers();

    const found = users.find(u => u.username.toLowerCase() === username && u.password === rawPassword);
    if (!found) {
      return { success: false, message: '用户名或密码错误' };
    }

    const userSession: User = {
      username: found.username,
      name: found.name || found.username,
      createdAt: found.createdAt
    };

    // 写入当前登录状态
    localStorage.setItem(BRAND_CONFIG.localStorageKeys.currentUser, JSON.stringify(userSession));
    setCurrentUser(userSession);

    return { success: true, message: '登录成功' };
  };

  // 退出登录逻辑
  // 必须只清除当前登录状态 key，绝不删除 yeyou_mancao_users 注册账号数据
  const logout = () => {
    localStorage.removeItem(BRAND_CONFIG.localStorageKeys.currentUser);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        register,
        login,
        logout,
        validateUsernameFormat,
        validatePasswordFormat
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
