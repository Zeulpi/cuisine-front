export const slugify = (str) => {
  const sluggedStr = str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

    return sluggedStr;
}
    
  
export const extractIdAndSlug = (sluggedId) => {
  const parts = sluggedId.split('-');
  return {
    id: parseInt(parts[0], 10),
    slug: parts.slice(1).join('-')
  };
};