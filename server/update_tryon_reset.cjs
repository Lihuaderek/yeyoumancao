const fs = require('fs');
let code = fs.readFileSync('src/pages/TryOnPage.tsx', 'utf8');

code = code.replace(
  /const \[color, setColor\] = useState<'red' \| 'gold' \| 'pink' \| 'blue'>\('red'\);\n  const \[fabric, setFabric\] = useState<'silk' \| 'satin' \| 'embroidery'>\('silk'\);/g,
  `const [color, setColor] = useState<string>('red');
  const [fabric, setFabric] = useState<string>('silk');

  useEffect(() => {
    if (selectedGarment.merchantColors && selectedGarment.merchantColors.length > 0) {
      setColor(selectedGarment.merchantColors[0].id);
    } else {
      setColor('red');
    }
    if (selectedGarment.merchantFabrics && selectedGarment.merchantFabrics.length > 0) {
      setFabric(selectedGarment.merchantFabrics[0].id);
    } else {
      setFabric('silk');
    }
  }, [selectedGarment]);`
);

fs.writeFileSync('src/pages/TryOnPage.tsx', code, 'utf8');
