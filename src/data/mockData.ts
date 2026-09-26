import { Garment, Designer } from '../types';

export const GARMENTS: Garment[] = [
  {
    id: 'men-xiuhe-01',
    name: '乾坤吉瑞 · 赤金盘龙文武袖男士秀禾服',
    category: '秀禾服',
    categoryName: '秀禾服',
    gender: 'men',
    price: 28800,
    originalPrice: 35800,
    image: '/images/garment_men_1.jpg',
    overlayImage: '/images/garment_men_1.jpg',
    tryonImage: '/images/tryon_men_1.jpg',
    description: '汉唐盘领经典吉服定制，胸前平金绣盘金团龙纹。',
    details: ['正统盘领文武袖吉服', '特织重磅朱红织金锦', '胸前整幅盘金刺绣', '配手工金丝刺绣祥云腰封'],
    fabrics: ['重磅织金锦', '天然桑蚕丝', '非遗罗纹绸'],
      colors: [
      { name: '华堂朱红', hex: '#B22222', value: 'red' },
      { name: '至尊明金', hex: '#C9A96E', value: 'gold' },
      { name: '玄墨玄青', hex: '#22262F', value: 'blue' },
      { name: '海棠初粉', hex: '#D97A8F', value: 'pink' }
    ],
    tags: ['正统吉服', '盘金团龙', '男士礼服'],
    isCustomizable: true,
    canTryOn: true,
    craftsmanship: '苏绣平金夹绣',
    target: '男士吉服'
  },
  {
    id: 'men-longfeng-02',
    name: '龙腾瑞气 · 黑金满绣对襟男士龙凤褂',
    category: '龙凤褂',
    categoryName: '龙凤褂',
    gender: 'men',
    price: 32800,
    originalPrice: 39800,
    image: '/images/garment_men_2.jpg',
    overlayImage: '/images/garment_men_2.jpg',
    tryonImage: '/images/tryon_men_2.jpg',
    description: '经典对襟立领，褂身满地金银线垫高浮雕立体绣。',
    details: ['经典对襟马褂', '黑金撞色满地盘金', '袖口海水江崖纹'],
    fabrics: ['真丝香云纱', '足金足银捻线'],
    colors: [
      { name: '玄武黑金', hex: '#1C1C1C', value: 'blue' },
      { name: '华堂朱红', hex: '#B22222', value: 'red' }
    ],
    tags: ['垫高立体绣', '海水江崖', '非遗传承'],
    isCustomizable: true,
    canTryOn: true,
    craftsmanship: '潮绣垫高立体绣',
    target: '男士吉服'
  },
  {
    id: 'men-hanfu-03',
    name: '明制婚服 · 织金妆花飞鱼服',
    category: '明制婚服',
    categoryName: '明制婚服',
    gender: 'men',
    price: 26800,
    originalPrice: 32800,
    image: '/images/garment_men_3.jpg',
    overlayImage: '/images/garment_men_3.jpg',
    tryonImage: '/images/tryon_men_3.jpg',
    description: '明制礼服经典圆领大襟，精选赤色织金缎，肩臂通袖织金过肩蟒纹。',
    details: ['严格依《大明会典》古制复原圆领大襟袍服', '肩臂通袖织金妆花蟒纹，金线交织璀璨', '侧缝内嵌暗褶摆，行走自如挺拔洒脱', '精选苏州特织漳缎，光泽温润手感厚实'],
    fabrics: ['妆花织金缎', '真丝漳缎', '辑里湖丝'],
    colors: [
      { name: '华堂朱红', hex: '#B22222', value: 'red' },
      { name: '玄墨玄青', hex: '#22262F', value: 'blue' }
    ],
    tags: ['明制圆领袍', '织金妆花', '非遗复原', '男士吉服'],
    isCustomizable: true,
    canTryOn: true,
    craftsmanship: '南京云锦妆花织造',
    target: '男士吉服'
  },
  {
    id: 'women-xiuhe-01',
    name: '百年好合 · 凤穿牡丹五重流苏秀禾服',
    category: '秀禾服',
    categoryName: '秀禾服',
    gender: 'women',
    price: 36800,
    originalPrice: 45800,
    image: '/images/garment_women_1.jpg',
    overlayImage: '/images/garment_women_1.jpg',
    tryonImage: '/images/tryon_women_1.jpg',
    description: '上袄下裙七分袖设计，前胸后背整幅双面苏绣凤穿牡丹。',
    details: ['经典上袄下裙形制', '胸背满绣凤穿牡丹', '纯金银线手工盘结五重流苏穗子'],
    fabrics: ['重磅真丝乔其', '天然桑蚕丝', '苏罗'],
    colors: [
      { name: '华堂朱红', hex: '#B22222', value: 'red' },
      { name: '海棠初粉', hex: '#D97A8F', value: 'pink' }
    ],
    tags: ['凤穿牡丹', '真丝乔其', '五重流苏', '女士嫁衣'],
    isCustomizable: true,
    canTryOn: true,
    craftsmanship: '苏绣双面平绣与打籽绣',
    target: '女士嫁衣'
  },
  {
    id: 'women-ming-02',
    name: '大唐盛景 · 齐胸瑞鹤齐胸衫裙',
    category: '唐宋制婚服',
    categoryName: '唐宋制婚服',
    gender: 'women',
    price: 42800,
    originalPrice: 52800,
    image: '/images/garment_women_2.jpg',
    overlayImage: '/images/garment_women_2.jpg',
    tryonImage: '/images/tryon_women_2.jpg',
    description: '唐制齐胸裙',
    details: ['复原唐制齐胸衫裙'],
    fabrics: ['真丝', '云锦'],
    colors: [
      { name: '华堂朱红', hex: '#B22222', value: 'red' }
    ],
    tags: ['唐制', '女士嫁衣'],
    isCustomizable: true,
    canTryOn: true,
    craftsmanship: '手工',
    target: '女士嫁衣'
  },
  {
    id: 'women-tang-03',
    name: '盛世风华 · 重工潮绣挂绿飞天旗袍',
    category: '旗袍',
    categoryName: '旗袍',
    gender: 'women',
    price: 29800,
    originalPrice: 36800,
    image: '/images/garment_women_3.jpg',
    overlayImage: '/images/garment_women_3.jpg',
    tryonImage: '/images/tryon_women_3.jpg',
    description: '旗袍',
    details: ['旗袍'],
    fabrics: ['真丝'],
    colors: [
      { name: '华堂朱红', hex: '#B22222', value: 'red' }
    ],
    tags: ['旗袍', '女士嫁衣'],
    isCustomizable: true,
    canTryOn: true,
    craftsmanship: '潮绣',
    target: '女士嫁衣'
  }
];

export const DESIGNERS: Designer[] = [
  {
    id: 'des-1',
    name: '张云心 师傅',
    title: '非遗苏绣传人 / 首席刺绣总监',
    yearsOfExperience: 32,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    description: '出生于苏州刺绣世家，八岁执针。曾参与故宫博物院多件明清后妃常服的修复工作。擅长运用平针、套针、抢针等三十多种传统针法。',
    specialty: '双面三异绣、劈丝极细平金绣',
    worksCount: 420
  },
  {
    id: 'des-2',
    name: '陈锦华 师傅',
    title: '潮绣大师 / 金银线盘金督导',
    yearsOfExperience: 45,
    avatar: 'https://images.unsplash.com/photo-1558222218-b7b54eede3f3?auto=format&fit=crop&q=80&w=200',
    description: '专注潮绣四十五载，独创的“棉蕊垫高浮雕绣”技法使得龙凤图腾栩栩如生、呼之欲出。其作品多次作为国礼馈赠外宾。',
    specialty: '垫高立体绣、密地金银线双面绣',
    worksCount: 285
  },
  {
    id: 'des-3',
    name: '林修远 师傅',
    title: '宫廷裁缝传人 / 首席立裁版师',
    yearsOfExperience: 28,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
    description: '传承百年红帮裁缝技艺，结合人体工学独创“三十六处骨相量体法”。经其手打版的婚服，能在不失古典威仪的前提下最大程度修饰当代人的身形比例。',
    specialty: '古法十字裁剪、三十六处精细立裁',
    worksCount: 1560
  }
];

export const PRESET_TRYON_MODELS = [
  { id: 'men-xiuhe-01', image: '/images/tryon_men_1.jpg', gender: 'men' },
  { id: 'men-longfeng-02', image: '/images/tryon_men_2.jpg', gender: 'men' },
  { id: 'men-hanfu-03', image: '/images/tryon_men_3.jpg', gender: 'men' },
  { id: 'women-xiuhe-01', image: '/images/tryon_women_1.jpg', gender: 'women' },
  { id: 'women-ming-02', image: '/images/tryon_women_2.jpg', gender: 'women' },
  { id: 'women-tang-03', image: '/images/tryon_women_3.jpg', gender: 'women' }
];

export const CUSTOM_OPTIONS = {
  styles: [
    { id: 'style-1', name: '明制立领衫', basePrice: 12800, gender: 'women', image: '/images/garment_women_1.jpg', desc: '经典明制款式', category: '明制婚服' },
    { id: 'style-2', name: '宋代大袖衫', basePrice: 16800, gender: 'women', image: '/images/garment_women_2.jpg', desc: '经典宋制款式', category: '唐宋制婚服' },
    { id: 'style-3', name: '明制圆领袍', basePrice: 11800, gender: 'men', image: '/images/garment_men_1.jpg', desc: '男士明制经典', category: '明制婚服' }
  ],
  patterns: [
    { id: 'pattern-1', name: '龙凤呈祥', desc: '金龙腾云，彩凤展翅', priceOffset: 3600 },
    { id: 'pattern-2', name: '江崖海水', desc: '下摆九重海水江崖', priceOffset: 2400 }
  ],

  colors: [
    { id: 'vermilion', name: '朱红（传统正红色）', hex: '#B22222', priceOffset: 0 },
    { id: 'imperial-gold', name: '金辉（至尊织金色）', hex: '#C9A96E', priceOffset: 3200 },
    { id: 'rose-pink', name: '霞粉（柔美海棠色）', hex: '#D97A8F', priceOffset: 1200 },
    { id: 'ink-blue', name: '玄青（典雅藏青色）', hex: '#2F3C48', priceOffset: 1500 }
  ],
  fabrics: [
    { id: 'silk', name: '天然桑蚕丝（柔滑光泽）', desc: '轻盈贴肤，自然珍珠哑光，透气亲肤', priceOffset: 0 },
    { id: 'satin', name: '重磅真丝织金锦（奢华挺括）', desc: '密织厚重，悬垂挺拔，富丽堂皇', priceOffset: 4800 },
    { id: 'embroidery', name: '金银线满底苏罗（非遗手织）', desc: '古法通经断纬，金银立体，传世珍藏', priceOffset: 8800 }
  ],
  embroidery: [
    { id: 'dragon-phoenix', name: '龙凤呈祥 · 天作之合', desc: '金龙腾云，彩凤展翅，阴阳交泰，万象更新', priceOffset: 3600 },
    { id: 'clouds-water', name: '江崖海水 · 福寿绵延', desc: '下摆九重海水江崖，寓意基业永固、福泽深厚', priceOffset: 2400 },
    { id: 'peony-bats', name: '牡丹五福 · 富贵吉祥', desc: '花开富贵与五福金蝠环绕，雍容温婉', priceOffset: 2800 },
    { id: 'double-joy', name: '并蒂双喜 · 连理同心', desc: '经典双喜同心结纹，古朴庄重，百年好合', priceOffset: 1800 }
  ]
};

export const CULTURAL_STORIES = [
  {
    id: 'story-1',
    title: '龙凤呈祥',
    subtitle: '传世经典',
    description: '中国传统纹样的巅峰之作',
    content: '龙凤呈祥图案源于...',
    tag: '工艺',
    image: '/images/garment_women_2.jpg'
  },
  {
    id: 'story-2',
    title: '苏绣非遗',
    subtitle: '指尖艺术',
    description: '针尖上的华夏色彩',
    content: '苏绣作为中国四大名绣之一...',
    tag: '非遗',
    image: '/images/garment_men_3.jpg'
  },
  {
    id: 'story-3',
    title: '明制大婚',
    subtitle: '仪态万方',
    description: '复原《大明会典》的端庄仪态',
    content: '明代婚服最高礼制...',
    tag: '历史',
    image: '/images/garment_men_1.jpg'
  }
];
