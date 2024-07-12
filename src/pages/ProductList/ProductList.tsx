import { useQuery } from '@tanstack/react-query'
import filter from '../../assets/icons//filter.svg'
import Product from './Product/Product'
// import Filter from 'src/components/Filter'
import productApi from 'src/apis/product.api'
import Pagination from 'src/components/Pagination'
import { ProductListConfig } from 'src/types/product.type'
import { Link, createSearchParams } from 'react-router-dom'
import item from '../../assets/img/product/item-1.png'
import categoryApi from 'src/apis/category.api'
import path from 'src/constants/path'
import classNames from 'classnames'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { useTranslation } from 'react-i18next'
// import slideshow from 'src/assets/img/item-1.png'

export default function ProductList() {
  const queryConfig = useQueryConfig()
  const { t } = useTranslation(['home', 'product'])

  const { data: productData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig as unknown as ProductListConfig)
    },
    staleTime: 3 * 60 * 1000
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getCategories()
    }
  })

  return (
    <>
      <section className='home__container container mt-7'>
        <div className='home__row flex items-center justify-between mb-2.5'>
          <h2
            className={classNames('home__heading text-22px font-semibold', {
              'text-red-800': !queryConfig.category
            })}
          >
            {t('aside filter.all categories')}
          </h2>
        </div>
        <div className='home__cate row row-cols-3 row-cols-md-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3'>
          {categoriesData?.data.data.map((categoryItem) => {
            const isActive = queryConfig.category === categoryItem._id
            return (
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    category: categoryItem._id
                  }).toString()
                }}
                key={categoryItem._id}
                className={classNames('cate-item flex gap-5 h-full px-5 py-6', {
                  'text-red-600': isActive
                })}
              >
                <img
                  src={item}
                  alt=''
                  className='cate-item__thumb w-[116px] h-[116px] object-contain rounded-lg bg-white'
                />
                <div className='cate-item__info flex flex-col justify-center'>
                  <h3 className='cate-item__title text-xl font-bold text-slate-950'>{categoryItem.name}</h3>
                  <p className='cate-item__desc mt-2 font-light text-base '>{categoryItem.name}</p>
                </div>
              </Link>
            )
          }) || []}
        </div>
      </section>
      <section className='home__container container  mt-7'>
        {productData && (
          <div>
            <div className='home__row flex items-center justify-between mb-2.5'>
              <h2 className='home__heading text-22px font-semibold'>Total LavAzza 1320</h2>
              <div className='filter-wrap relative'>
                <button className='filter-btn flex items-center gap-3.5 h-9 text-sm font-semibold text-gray-500 bg-white py-0 px-3.5'>
                  Filter
                  <img src={filter} alt='' className='filter-btn__icon icon' />
                </button>
                {/* <Filter queryConfig={queryConfig} /> */}
              </div>
            </div>

            <div className='row row-cols-4 row-cols-lg-2 row-cols-sm-1 g-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-7'>
              {productData.data.data.products.map((product) => (
                <div className='col-span-1' key={product._id}>
                  <Product product={product} />
                </div>
              ))}
            </div>
            <Pagination queryConfig={queryConfig} pageSize={productData.data.data.pagination.page_size} />
          </div>
        )}
      </section>
    </>
  )
}
