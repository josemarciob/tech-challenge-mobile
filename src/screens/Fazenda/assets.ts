export const getGrowingPlantArt = (dbIcon: string) => {
  const images: Record<string, any> = {
    'wheat': require('../../../assets/farm/Trigo.png'),
    'pumpkin': require('../../../assets/farm/Abobora.png'),
    'corn': require('../../../assets/farm/Milho.png'),
  };
  return images[dbIcon] || images['wheat'];
};

export const getGameAsset = (iconKey?: string, itemName?: string) => {
  const assets: Record<string, any> = {
    'wheat': require('../../../assets/farm/SementeTrigo.png'),
    'corn': require('../../../assets/farm/SementeMilho.png'),
    'pumpkin': require('../../../assets/farm/SementeAbobora.png'),
    'wheat_icon': require('../../../assets/farm/SacaTrigo.png'),
    'corn_icon': require('../../../assets/farm/Milho.png'),
    'pumpkin_harvested': require('../../../assets/farm/Abobora.png'),
    'egg_icon': require('../../../assets/farm/Ovo.png'),
    'chicken': require('../../../assets/farm/Galinha.png'),
    'market_ui': require('../../../assets/farm/Mercado.png'),
    'warehouse_ui': require('../../../assets/farm/Armazen.png'),
    'coop': require('../../../assets/farm/Galinheiro.png'),
    'barn': require('../../../assets/farm/Celeiro.png'),
    'cow': require('../../../assets/farm/Vaca.png'),
  };

  if (iconKey && assets[iconKey]) return assets[iconKey];
  if (itemName) {
    const n = itemName.toLowerCase();
    if (n.includes('semente') && n.includes('trigo')) return assets['wheat'];
    if (n.includes('semente') && n.includes('milho')) return assets['corn'];
    if (n.includes('semente') && n.includes('abobora')) return assets['pumpkin'];
    if (n.includes('saca') && n.includes('trigo')) return assets['wheat_icon'];
    if (n.includes('ovo')) return assets['egg_icon'];
    if (n.includes('galinha')) return assets['chicken'];
  }
  return assets['wheat'];
};