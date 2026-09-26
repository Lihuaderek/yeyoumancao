const fs = require('fs');
let content = fs.readFileSync('src/pages/ShopPage.tsx', 'utf8');

// Add state for remote garments and useEffect
content = content.replace(/const \[selectedGarment, setSelectedGarment\] = useState<Garment \| null>\(null\);/, `const [selectedGarment, setSelectedGarment] = useState<Garment | null>(null);
  const [remoteGarments, setRemoteGarments] = useState<Garment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.products) {
          setRemoteGarments(data.products);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);`);

// Combine GARMENTS and remoteGarments
content = content.replace(/const filteredGarments = GARMENTS\.filter/, `const allGarments = [...GARMENTS, ...remoteGarments];
  const filteredGarments = allGarments.filter`);

fs.writeFileSync('src/pages/ShopPage.tsx', content, 'utf8');
