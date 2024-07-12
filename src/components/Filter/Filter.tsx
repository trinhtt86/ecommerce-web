import Button from '../Button'
import Input from '../Input'
import selectArrow from '../../assets/icons/arrow-down.svg'
// import search from '../../assets/icons/search.svg'
import { sortBy, order as orderConstant } from 'src/constants/product'
import classNames from 'classnames'
import { ProductListConfig } from 'src/types/product.type'
import { createSearchParams, useNavigate } from 'react-router-dom'
import path from 'src/constants/path'
import omit from 'lodash/omit'
import InputNumber from '../InputNumber'
import { Controller, Resolver, useForm } from 'react-hook-form'
import { Schema, schema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { NoUndefinedField } from 'src/utils/utils'
import { QueryConfig } from 'src/hooks/useQueryConfig'
import { useTranslation } from 'react-i18next'

interface Props {
  queryConfig: QueryConfig
}

type FormData = NoUndefinedField<Pick<Schema, 'price_max' | 'price_min'>>
const priceSchema = schema.pick(['price_min', 'price_max'])
export default function Filter({ queryConfig }: Props) {
  const { t } = useTranslation()
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      price_min: '' as unknown as string,
      price_max: '' as unknown as string
    },
    resolver: yupResolver(priceSchema) as Resolver<FormData>
  })
  const { sort_by = sortBy.createdAt, order } = queryConfig

  const navigate = useNavigate()
  const isActiveSortBy = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    return sort_by === sortByValue
  }
  const handleSort = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    const newSearchParams = createSearchParams(
      omit(
        {
          ...queryConfig,
          sort_by: sortByValue
        },
        ['order']
      )
    ).toString()

    navigate({
      pathname: path.home,
      search: newSearchParams
    })
  }
  const onSubmit = handleSubmit((data) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        price_min: data.price_min,
        price_max: data.price_max
      }).toString()
    })
  })
  const handlePriceOrder = (orderValue: Exclude<ProductListConfig['order'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        sort_by: sortBy.price,
        order: orderValue
      }).toString()
    })
  }
  const handleRemoveAll = () => {
    navigate({
      pathname: path.home,
      search: createSearchParams(omit(queryConfig, ['category', 'price_min', 'price_max'])).toString()
    })
  }
  return (
    <div id='home-filter' className='filter absolute right-0 top-12 bg-white rounded-2xl p-7 z-10 shadow'>
      <img src='./assets/icons/arrow-up.png' alt='' className='filter__arrow' />
      <h3 className='filter__heading text-2xl font-medium'>Filter</h3>
      <form action='' className='filter__form form mt-7 relative' onSubmit={onSubmit}>
        <div className='filter__row filter__content flex'>
          <div className='filter__col'>
            <div className='form__label text-2xl font-medium'>Price</div>
            <div className='filter__form-group mt-5'></div>
            <div className='filter__form-group filter__form-group--inline flex gap-7'>
              <div>
                <div className='form__label form__label--small text-sm mb-2.5'> Minimum </div>
                <div className='filter__form-text-input filter__form-text-input--small'>
                  <Controller
                    control={control}
                    name='price_min'
                    render={({ field }) => {
                      return (
                        <InputNumber
                          defaultValue=''
                          type='text'
                          placeholder='30'
                          className='text-sm font-medium rounded-md h-9 px-3 w-28 border border-cyan-500 border-solid'
                          {...field}
                          onChange={(event) => {
                            field.onChange(event), trigger('price_max')
                          }}
                        />
                      )
                    }}
                  />
                </div>
              </div>
              <div>{errors.price_min?.message}</div>
              <div>
                <div className='form__label form__label--small text-sm mb-2.5'> Maximum </div>
                <div className='filter__form-text-input filter__form-text-input--small'>
                  <Controller
                    control={control}
                    name='price_max'
                    render={({ field }) => {
                      return (
                        <InputNumber
                          defaultValue=''
                          type='text'
                          placeholder='130'
                          className='text-sm font-medium rounded-md h-9 px-3 w-28 border border-cyan-500 border-solid'
                          {...field}
                          onChange={(event) => {
                            field.onChange(event), trigger('price_min')
                          }}
                        />
                      )
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='filter__separate w-px mx-7 my-0 bg-white'></div>

          <div className='filter__col'>
            <div className='form__label text-2xl font-medium'>Size/Weight</div>
            <div className='filter__form-group mt-5'>
              <div className='form__select-wrap border border-gray-300 rounded-md h-11 flex items-center'>
                <select
                  onChange={(event) =>
                    handlePriceOrder(event.target.value as Exclude<ProductListConfig['order'], undefined>)
                  }
                  value={order || ''}
                  defaultValue=''
                  className='form__select px-3.5 flex items-center justify-between text-sm font-medium min-w-32'
                >
                  <option value='' disabled>
                    Gia
                  </option>
                  <option value={orderConstant.desc}>Gia cao den gia thap</option>
                  <option value={orderConstant.asc}>gia thap den cao</option>
                  <img src={selectArrow} alt='' className='form__select-arrow icon' />
                </select>
                <select className='form__select px-3.5 flex items-center text-sm justify-between font-medium min-w-28 border-l border-gray-300'>
                  <option value='gram'>Gram</option>
                  <option value='kg'>Kg</option>
                  <img src={selectArrow} alt='' className='form__select-arrow icon' />
                </select>
              </div>
            </div>
            <div className='filter__form-group'>
              <div className='form__tags flex gap-9'>
                <button
                  type='button'
                  onClick={() => handleSort(sortBy.view)}
                  className={classNames(
                    'form__tag rounded-sm text-slate-400 hover:text-slate-950 bg-white text-sm font-medium py-1.5 px-3',
                    {
                      'text-orange-800': isActiveSortBy(sortBy.view),
                      'text-black hover:text-white': !isActiveSortBy(sortBy.view)
                    }
                  )}
                >
                  Phổ biến
                </button>
                <button
                  type='button'
                  onClick={() => handleSort(sortBy.createdAt)}
                  className={classNames(
                    'form__tag rounded-sm text-slate-400 hover:text-slate-950 bg-white text-sm font-medium py-1.5 px-3',
                    {
                      'text-orange-800': isActiveSortBy(sortBy.createdAt),
                      'text-black hover:text-white': !isActiveSortBy(sortBy.createdAt)
                    }
                  )}
                >
                  Mới nhất
                </button>
                <button
                  type='button'
                  onClick={() => handleSort(sortBy.sold)}
                  className={classNames(
                    'form__tag rounded-sm text-slate-400 hover:text-slate-950 bg-white text-sm font-medium py-1.5 px-3',
                    {
                      'text-orange-800': isActiveSortBy(sortBy.sold),
                      'text-black hover:text-white': !isActiveSortBy(sortBy.sold)
                    }
                  )}
                >
                  Bán chạy
                </button>
              </div>
            </div>
          </div>

          <div className='filter__separate w-px mx-7 my-0 bg-white'></div>

          <div className='filter__col'>
            <div className='form__label text-2xl font-medium'>Brand</div>
            <div className='filter__form-group mt-5'>
              <div className='filter__form-text-input w-80'>
                <Input
                  defaultValue=''
                  type='text'
                  name=''
                  id=''
                  placeholder='Search brand name'
                  className='filter__form-input w-full text-sm'
                  // icon={search}
                />
              </div>
            </div>
            <div className='filter__form-group'>
              <div className='form__tags flex gap-9'>
                <button className='form__tag rounded-sm text-slate-400 hover:text-slate-950 bg-white text-sm font-medium py-1.5 px-3'>
                  Lavazza
                </button>
                <button className='form__tag rounded-sm text-slate-400 hover:text-slate-950 bg-white text-sm font-medium py-1.5 px-3'>
                  Nescafe
                </button>
                <button className='form__tag rounded-sm text-slate-400 hover:text-slate-950 bg-white text-sm font-medium py-1.5 px-3'>
                  Starbucks
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className='filter__row filter__footer mt-7 flex justify-end '>
          <Button
            onClick={handleRemoveAll}
            className='flex items-center justify-center gap-2.5 h-9 py-0 px-3 rounded-md bg-transparent text-sm font-normal whitespace-nowrap select-none hover:opacity-90'
          >
            Cancel
          </Button>
          <Button className='btn--primary ml-3 flex items-center justify-center gap-2.5 h-9 py-0 px-3 rounded-md bg-primary text-sm font-medium whitespace-nowrap select-none hover:opacity-90'>
            Show Result
          </Button>
        </div>
      </form>
    </div>
  )
}
