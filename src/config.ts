/**
 * 野有蔓草 · 全局配置项中心
 * 包含品牌信息、联系方式、演示定价说明、以及下单二维码生成配置
 */

export const BRAND_CONFIG = {
  name: '野有蔓草',
  fullName: '野有蔓草 · 传统婚嫁礼服定制平台',
  slogan: '野有蔓草，零露漙兮。执子之手，与子偕老。',
  subSlogan: '传千年非遗华服雅韵 · 定一生一世锦绣良缘',
  contact: {
    phone: '400-820-9988',
    hours: '周一至周日 09:30 - 21:30',
    address: '江苏省苏州市姑苏区平江历史街区刺绣非遗工坊8号院',
    email: 'service@yeyoumancao.art',
  },
  // 演示定价警示语，防止真实下单
  pricingDisclaimer: '【重要说明】当前价格为高级非遗工艺演示估值，非真实线上交易售价。',
  // 下单二维码生成逻辑配置
  getQrContent: () => {
    // 后续替换真实付款码：将 qrContent 改为真实支付链接即可
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/maintenance.html`;
    }
    return 'https://yeyoumancao.art/maintenance.html';
  },
  localStorageKeys: {
    users: 'yeyou_mancao_users',
    currentUser: 'yeyou_mancao_current_user',
    cartPrefix: 'yeyou_mancao_cart_',
    ordersPrefix: 'yeyou_mancao_orders_',
  }
};
