const fs = require('fs');

let content = fs.readFileSync('src/pages/CustomPage.tsx', 'utf8');

// 1. Import GARMENTS and Garment type
if (!content.includes('GARMENTS')) {
  content = content.replace(/import \{ CUSTOM_OPTIONS \} from '\.\.\/data\/mockData';/, "import { CUSTOM_OPTIONS, GARMENTS } from '../data/mockData';\nimport { Garment } from '../types';");
}

// 2. Add state for remoteGarments
const stateAdd = `
  const [remoteGarments, setRemoteGarments] = useState<Garment[]>([]);
  const [styles, setStyles] = useState(CUSTOM_OPTIONS.styles);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.products) {
          setRemoteGarments(data.products);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const allGarments = [...GARMENTS, ...remoteGarments];
    const dynamicStyles = allGarments.map(g => ({
      id: g.id,
      name: g.name,
      basePrice: g.price,
      gender: g.gender as 'men' | 'women',
      image: g.image || g.overlayImage || '/images/ar_dress1.svg',
      desc: g.description,
      category: g.category
    }));
    setStyles(dynamicStyles);
    
    // 如果 URL 参数在 dynamicStyles 中，或者当前 selectedStyleId 在里面
    const foundByUrl = dynamicStyles.find(s => s.id === styleIdParam);
    if (foundByUrl) {
      setSelectedStyleId(foundByUrl.id);
      setGenderFilter(foundByUrl.gender);
    } else if (!dynamicStyles.find(s => s.id === selectedStyleId) && dynamicStyles.length > 0) {
      setSelectedStyleId(dynamicStyles[0].id);
    }
  }, [remoteGarments, styleIdParam]);
`;

// Inject stateAdd after `const styleIdParam = searchParams.get('id');`
if (!content.includes('remoteGarments')) {
  content = content.replace(/const styleIdParam = searchParams\.get\('id'\);/, `const styleIdParam = searchParams.get('id');\n${stateAdd}`);
}

// Replace CUSTOM_OPTIONS.styles with styles
content = content.replace(/CUSTOM_OPTIONS\.styles/g, 'styles');

// Fix selectedStyleId initialization since styles isn't ready
content = content.replace(
  /const \[selectedStyleId, setSelectedStyleId\] = useState\([\s\S]*?\);/,
  `const [selectedStyleId, setSelectedStyleId] = useState(styleIdParam || 'g1');`
);

fs.writeFileSync('src/pages/CustomPage.tsx', content, 'utf8');
