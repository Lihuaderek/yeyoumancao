const fs = require('fs');
let code = fs.readFileSync('src/pages/TryOnPage.tsx', 'utf8');

// 1. Add fetching state and logic
code = code.replace(
  /const garmentIdParam = searchParams\.get\('id'\);\n  const initialGarment = GARMENTS\.find\(g => g\.id === garmentIdParam\) \|\| GARMENTS\[0\];\n\n  const \[selectedGarment, setSelectedGarment\] = useState<Garment>\(initialGarment\);/,
  `const garmentIdParam = searchParams.get('id');
  const initialGarment = GARMENTS.find(g => g.id === garmentIdParam) || GARMENTS[0];
  
  const [selectedGarment, setSelectedGarment] = useState<Garment>(initialGarment);
  const [allProducts, setAllProducts] = useState<Garment[]>([...GARMENTS]);

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => {
        if (data.success && data.products) {
          const combined = [...GARMENTS, ...data.products];
          setAllProducts(combined);
          const found = combined.find((g: Garment) => g.id === garmentIdParam);
          if (found) setSelectedGarment(found);
        }
      })
      .catch(console.error);
  }, [garmentIdParam]);`
);

// 2. Remove "选择礼服" block entirely
code = code.replace(
  /              <div>\n                <label className="text-xs font-serif font-bold block mb-2">选择礼服<\/label>[\s\S]*?<\/div>\n              <\/div>/,
  ''
);

// 3. Dynamic custom options definition (above COLOR_OPTIONS map)
code = code.replace(
  /              <div className="space-y-3 pt-3 border-t border-gold\/20">\n                <div className="grid grid-cols-4 gap-1">\n                  \{COLOR_OPTIONS\.map\(c =>/g,
  `              <div className="space-y-3 pt-3 border-t border-gold/20">
                <div className="grid grid-cols-4 gap-1">
                  {(selectedGarment.merchantColors || COLOR_OPTIONS).map((c: any) =>`
);

// 4. Also dynamic custom options for fabric
code = code.replace(
  /                <\/div>\n                <div className="grid grid-cols-3 gap-1">\n                  \{FABRIC_OPTIONS\.map\(f =>/g,
  `                </div>
                <div className="grid grid-cols-3 gap-1">
                  {(selectedGarment.merchantFabrics || FABRIC_OPTIONS).map((f: any) =>`
);

// 5. Fix c.name.slice(2) since merchant colors might have short names
code = code.replace(
  /\{c\.name\.slice\(2\)\}<\/button>\)}/g,
  `{c.name.length > 2 && c.hex ? c.name.slice(2) : c.name}</button>)}`
);

fs.writeFileSync('src/pages/TryOnPage.tsx', code, 'utf8');
