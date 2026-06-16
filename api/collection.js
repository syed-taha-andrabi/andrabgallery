export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const databaseId = process.env.NOTION_DATABASE_ID;
  const notionKey = process.env.NOTION_SECRET;

  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${notionKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ page_size: 100 })
    });

    const data = await response.json();

    const products = data.results.map(page => {
      const p = page.properties;
      return {
        name:            p['Name']?.title?.[0]?.plain_text || '',
        type:            p['Type']?.select?.name || '',
        size:            p['Size']?.rich_text?.[0]?.plain_text || '',
        price:           p['Price']?.rich_text?.[0]?.plain_text || '',
        material:        p['Material']?.rich_text?.[0]?.plain_text || '',
        description:     p['Description']?.rich_text?.[0]?.plain_text || '',
        image_url:       p['Image 1']?.files?.[0]?.file?.url || p['Image 1']?.files?.[0]?.external?.url || '',
        image_url_2:     p['Image 2']?.files?.[0]?.file?.url || p['Image 2']?.files?.[0]?.external?.url || '',
        image_url_3:     p['Image 3']?.files?.[0]?.file?.url || p['Image 3']?.files?.[0]?.external?.url || '',
        badge:           p['Badge']?.select?.name || '',
        whatsapp_number: p['WhatsApp']?.rich_text?.[0]?.plain_text || '',
        gender:          p['Gender']?.select?.name || '',
        gi_certified:    p['GI Certified']?.checkbox || false,
        craft:           p['Craft']?.rich_text?.[0]?.plain_text || '',
        featured:        p['Featured']?.checkbox || false
      };
    }).filter(p => p.name.trim() !== '');

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}
