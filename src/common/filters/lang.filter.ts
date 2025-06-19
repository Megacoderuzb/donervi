type Item = Record<string, any>;

type FilterByLang = (
  items: Item[] | Item,
  lang: string,
  deleteFields: string, // Whether to delete language-specific fields
  fieldConfig: string[] // Array of fields to filter (e.g., ['name', 'subcategory.name'])
) => Item[] | Item;

const filterByLang: FilterByLang = (
  items,
  lang,
  deleteFields = "false",
  fieldConfig
) => {
  if (!lang) {
    return items;
  }

  items = JSON.parse(JSON.stringify(items));
  const langSuffix = `_${lang.toLowerCase().trim()}`;
  const allLangSuffixes = ["_uz", "_ru", "_en", "_tr"];

  const processField = (obj: any, fieldPath: string[]): void => {
    let current = obj;
    const lastIndex = fieldPath.length - 1;

    // Navigate through the path
    for (let i = 0; i < lastIndex; i++) {
      const key = fieldPath[i];
      if (!current[key]) {
        return; // Exit if the path doesn’t exist
      }
      // If it’s an array, process each item in the array
      if (Array.isArray(current[key])) {
        current[key].forEach((item: any) =>
          processField(item, fieldPath.slice(i + 1))
        );
        return;
      }
      current = current[key];
    }

    const lastField = fieldPath[lastIndex];
    const langField = `${lastField}${langSuffix}`;

    if (current && langField in current) {
      current[lastField] = current[langField];
      if (JSON.parse(deleteFields)) {
        allLangSuffixes.forEach((suffix) => {
          const fieldWithSuffix = `${lastField}${suffix}`;
          if (fieldWithSuffix in current) {
            delete current[fieldWithSuffix];
          }
        });
      }
    }
  };

  const processItem = (item: Item): Item => {
    const newItem = { ...(item._doc ?? item) };
    fieldConfig.forEach((field) => {
      const fieldPath = field.split(".");
      processField(newItem, fieldPath);
    });
    return newItem;
  };

  if (Array.isArray(items)) {
    return items.map(processItem);
  }
  return processItem(items);
};

export default filterByLang;
