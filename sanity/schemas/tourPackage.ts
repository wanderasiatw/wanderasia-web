export const tourPackage = {
  name: 'tourPackage',
  title: 'Tour Package',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
    },
    { name: 'price', title: 'Price (USD)', type: 'number' },
    { name: 'duration', title: 'Duration', type: 'string' },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
      options: { list: ['Japan', 'Taiwan', 'Korea', 'Thailand'] },
    },
    {
      name: 'tourType',
      title: 'Tour Type',
      type: 'string',
      options: { list: ['Sakura', 'Culture', 'Winter'] },
    },
    { name: 'rating', title: 'Rating (e.g. 4.9)', type: 'number' },
    { name: 'mainImage', title: 'Main Image', type: 'image', options: { hotspot: true } },
    { name: 'featured', title: 'Featured', type: 'boolean' },
    { name: 'description', title: 'Description', type: 'text' },
    {
      name: 'highlights',
      title: 'Highlights',
      type: 'array',
      of: [{ type: 'string' }],
    },
  ],
}
