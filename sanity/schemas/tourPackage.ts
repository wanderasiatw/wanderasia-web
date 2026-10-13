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
    {
      name: 'category',
      title: 'Category',
      description: 'Which row the tour appears in on the website',
      type: 'string',
      options: {
        list: [
          { title: 'Free Tours', value: 'free' },
          { title: 'Food Tours', value: 'food' },
          { title: 'Night / Drink Tours', value: 'night' },
          { title: 'Hiking Tours', value: 'hiking' },
          { title: 'Special Request Tours', value: 'special' },
        ],
      },
    },
    { name: 'location', title: 'Location (e.g. Taipei)', type: 'string' },
    { name: 'price', title: 'Price (USD, 0 = free, leave empty = price on request)', type: 'number' },
    { name: 'duration', title: 'Duration (e.g. About 2.5 hours)', type: 'string' },
    { name: 'meetingPoint', title: 'Meeting Point', type: 'string' },
    { name: 'startTime', title: 'Start Time (e.g. 7:00 PM)', type: 'string' },
    { name: 'mainImage', title: 'Main Image', type: 'image', options: { hotspot: true } },
    { name: 'featured', title: 'Featured', type: 'boolean' },
    { name: 'comingSoon', title: 'Details coming soon', type: 'boolean' },
    { name: 'description', title: 'Short Description (cards)', type: 'text', rows: 2 },
    { name: 'body', title: 'Full Description (blank line between paragraphs)', type: 'text', rows: 8 },
    {
      name: 'highlights',
      title: 'Highlights',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'tastings',
      title: 'Tastings / Stops',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Name', type: 'string' },
            { name: 'nameZh', title: 'Chinese Name', type: 'string' },
            { name: 'image', title: 'Photo', type: 'image', options: { hotspot: true } },
          ],
        },
      ],
    },
    { name: 'note', title: 'Note (e.g. tips welcome)', type: 'string' },
  ],
}
