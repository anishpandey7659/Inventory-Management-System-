  
export const buildFilterParams = (filters) => {
  const params = {};

  // status (array → comma separated)
  if (filters.status?.length) {
    params.status = filters.status.join(',');
  }

  // categories (objects → ids)
  if (filters.categories?.length) {
    params.category = filters.categories.map(c => c.id).join(',');
  }

  // price range
  if (filters.priceRange?.min != null) {
    params.min_selling_price = filters.priceRange.min;
  }
  if (filters.priceRange?.max != null) {
    params.max_selling_price = filters.priceRange.max;
  }


  // quantity filter
  if (filters.quantityFilter) {
    params.quantity_range = filters.quantityFilter;
  }
  if (filters.ordering) {
    params.ordering = filters.ordering;
  }

  return params;
};
