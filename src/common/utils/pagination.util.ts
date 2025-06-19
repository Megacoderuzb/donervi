
import { Model } from 'mongoose';

function buildUrl(
  baseUrl: string,
  page: number,
  perPage: number,
  filter: Record<string, any> = {},
  isAll: boolean = false,
): string {
  const url = new URL(baseUrl);
  url.searchParams.set('page', page.toString());

  url.searchParams.set('limit', isAll ? 'all' : perPage.toString());

  if (Object.keys(filter).length > 0) {
    url.searchParams.set('filter', JSON.stringify(filter));
  }

  return url.toString();
}

export async function paginate(
  model: Model<any>,
  query: any,
  populateConfig?: string[], 
) {
  const page = Math.max(1, Number(query.page || 1));
  const isAll = query.limit === 'all';
  const perPage = isAll
    ? Number.MAX_SAFE_INTEGER
    : Math.max(1, Math.min(100, Number(query.limit || 10)));
  const filter = query.filter || {};
  const baseUrl = query.baseUrl || '';
  const skip = (page - 1) * perPage;

  try {
    let data, totalCount, totalPages;

    if (isAll) {
      const queryBuilder = model.find(filter);

      if (populateConfig && populateConfig.length > 0) {
        queryBuilder.populate(populateConfig);
      }

      [data, totalCount] = await Promise.all([
        queryBuilder.exec(),
        model.countDocuments(filter),
      ]);
      totalPages = 1; 
    } else {
      const queryBuilder = model
        .find(filter)
        .skip(skip)
        .limit(perPage);

      if (populateConfig && populateConfig.length > 0) {
        queryBuilder.populate(populateConfig);
      }

      [data, totalCount] = await Promise.all([
        queryBuilder.exec(),
        model.countDocuments(filter),
      ]);
      totalPages = Math.ceil(totalCount / perPage);
    }

    return {
      data,
      _meta: {
        currentPage: isAll ? 1 : page,
        perPage: isAll ? totalCount : perPage,
        totalCount,
        totalPages,
      },
      _links: {
        self: buildUrl(baseUrl, isAll ? 1 : page, perPage, filter, isAll),
        first: buildUrl(baseUrl, 1, perPage, filter, isAll),
        prev:
          isAll || page <= 1
            ? null
            : buildUrl(baseUrl, page - 1, perPage, filter, isAll),
        next:
          isAll || page >= totalPages
            ? null
            : buildUrl(baseUrl, page + 1, perPage, filter, isAll),
        last: buildUrl(baseUrl, isAll ? 1 : totalPages, perPage, filter, isAll),
      },
    };
  } catch (error) {
    throw new Error(`Pagination failed: ${error.message}`);
  }
}