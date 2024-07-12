import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import classNames from 'classnames'
import { useNavigate, useParams } from 'react-router-dom'
import productApi from 'src/apis/product.api'
import arrowR from 'src/assets/icons/arrow-right.svg'
import star from 'src/assets/icons/star.svg'
import { ProductListConfig } from 'src/types/product.type'
import path from 'src/constants/path'
import selectArrow from 'src/assets/icons/select-arrow.svg'
import document from 'src/assets/icons/document.svg'
import buy from 'src/assets/icons/buy.svg'
import bag from 'src/assets/icons/bag.svg'
import heart from 'src/assets/icons/heart.svg'
import DOMPurify from 'dompurify'
import { formatCurrency, getIdFromNameId, rateScale } from 'src/utils/utils'
import { useEffect, useMemo, useState } from 'react'
import Product from '../ProductList/Product'
import QuantityController from 'src/components/QuantityController'
import purchaseApi from 'src/apis/purchase.api'
import { purchasesStatus } from 'src/constants/purchase'
import { toast } from 'react-toastify'
import { Helmet } from 'react-helmet-async'
import { convert } from 'html-to-text'

export default function ProductDetail() {
  const [buyCount, setByCount] = useState(1)

  const handleBuyCount = (value: number) => {
    setByCount(value)
  }
  const queryClient = useQueryClient()
  const { nameId } = useParams()
  const id = getIdFromNameId(nameId as string)
  const { data: productDetailData } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getProductDetail(id as string)
  })
  const product = productDetailData?.data.data

  const [currentIndexImages] = useState([0, 4])
  const [activeImg, setActiveImg] = useState('')
  const currentImages = useMemo(
    () => (product ? product.images.slice(...currentIndexImages) : []),
    [product, currentIndexImages]
  )

  const chooseActive = (img: string) => {
    setActiveImg(img)
  }

  useEffect(() => {
    if (product && product.images.length > 0) {
      setActiveImg(product.images[0])
    }
  }, [product])

  const queryConfig: ProductListConfig = { limit: '20', page: '1', category: product?.category._id }
  const { data: productData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig)
    },
    enabled: Boolean(product),
    staleTime: 3 * 60 * 1000
  })
  const navigate = useNavigate()

  const addToCartMutation = useMutation({
    mutationFn: (body: { buy_count: number; product_id: string }) => purchaseApi.addToCart(body)
  })

  const addToCart = () => {
    addToCartMutation.mutate(
      { buy_count: buyCount, product_id: product?._id as string },
      {
        onSuccess: (data) => {
          console.log(data)
          toast.success(data.data.message)
          queryClient.invalidateQueries({ queryKey: ['purchases', { status: purchasesStatus.inCart }] })
        }
      }
    )
  }
  const buyNow = async () => {
    const res = await addToCartMutation.mutateAsync({ buy_count: buyCount, product_id: product?._id as string })
    const purchase = res.data.data
    navigate(path.cart, {
      state: {
        purchaseId: purchase._id
      }
    })
  }
  if (!product) return null
  return (
    <main className='product-page  flex flex-col min-h-[80vh]  '>
      <Helmet>
        <title>{product.name} | Shopee Clone</title>
        <meta
          name='description'
          content={convert(product.description, {
            limits: {
              maxInputLength: 150
            }
          })}
        />
      </Helmet>
      <div className='container '>
        <div className='product-container mt-8'>
          <ul className='breadcrumbs flex flex-wrap items-center gap-7 min-h-[64px] p-5 rounded-xl bg-slate-100'>
            <li>
              <a
                href='#!'
                className='breadcrumbs__link flex items-center flex-wrap gap-2 text-[#9e9da8] text-15px font-normal whitespace-nowrap'
              >
                Departments
                <img src={arrowR} alt='' />
              </a>
            </li>
            <li>
              <a
                href='#!'
                className='breadcrumbs__link flex items-center flex-wrap gap-2 text-[#9e9da8] text-15px font-normal whitespace-nowrap'
              >
                Coffee
                <img src={arrowR} alt='' />
              </a>
            </li>
            <li>
              <a
                href='#!'
                className='breadcrumbs__link flex items-center flex-wrap gap-2 text-[#9e9da8] text-15px font-normal whitespace-nowrap'
              >
                Coffee Beans
                <img src={arrowR} alt='' />
              </a>
            </li>
            <li>
              <a
                href='#!'
                className='breadcrumbs__link flex flex-wrap gap-2 text-[#9e9da8] text-15px font-normal whitespace-nowrap breadcrumbs__link--current text-inherit'
              >
                LavAzza
              </a>
            </li>
          </ul>
        </div>

        <div className='product-container prod-info-content mt-8 rounded-2xl bg-slate-100'>
          <div className='row grid grid-cols-12 gap-9'>
            <div className='col-5 col-xl-6 col-lg-12 col-span-5'>
              <div className='prod-preview py-0 px-7'>
                <div className='prod-preview__list flex overflow-hidden'>
                  <div className='prod-preview__item relative w-full shrink-0 pt-[92%]'>
                    <img
                      src={activeImg}
                      alt={product.name}
                      className='prod-preview__img absolute top-0 left-0 w-full h-full object-contain'
                    />
                  </div>
                </div>
                <div className='prod-preview__thumbs flex items-center justify-center gap-4 p-7'>
                  {currentImages.map((img) => {
                    const isActive = img === activeImg
                    return (
                      <img
                        onMouseEnter={() => chooseActive(img)}
                        key={img}
                        src={img}
                        alt={product.name}
                        className={classNames(
                          'prod-preview__thumb-img prod-preview__thumb-img--current w-[65px] h-[65px] object-contain border border-solid border-slate-400 opacity-90 rounded-lg hover:opacity-1 hover:boder-[#9e9da8] hover:cursor-pointer',
                          {
                            'border-2 border-blue-900': isActive
                          }
                        )}
                      />
                    )
                  })}
                </div>
              </div>
            </div>
            <div className='col-7 col-xl-6 col-lg-12 col-span-7'>
              <form action='' className='form'>
                <section className='prod-info p-16 rounded-lg bg-white'>
                  <h1 className='prod-info__heading text-2xl font-medium'>{product.name}</h1>
                  <div className='row grid grid-cols-12 gap-9'>
                    <div className='col-5 col-xxl-6 col-xl-12 col-span-5'>
                      <div className='prod-prop flex items-center gap-1 mt-7'>
                        <img src={star} alt='' className='prod-prop__icon ' />
                        <h4 className='prod-prop__title text-lg font-normal'>{product.rating} 1100 reviews</h4>
                      </div>
                      <div className='form__label prod-info__label mt-7 text-2xl font-medium'>Size/Weight</div>
                      <div className='filter__form-group mt-5'>
                        <div className='form__select-wrap border border-gray-300 rounded-md h-11 flex items-center'>
                          <div className='form__select px-3.5 flex items-center justify-between text-sm font-normal min-w-32'>
                            500g
                            <img src={selectArrow} alt='' className='form__select-arrow icon' />
                          </div>
                          <div className='form__select px-3.5 flex items-center justify-between text-sm font-normal min-w-32'>
                            Gram
                            <img src={selectArrow} alt='' className='form__select-arrow icon' />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='col-7 col-xxl-6 col-xl-12 col-span-7'>
                      <div className='prod-props pl-8'>
                        <div className='prod-prop flex gap-4 mt-7'>
                          <img src={document} alt='' className='prod-prop__icon icon' />
                          <h4 className='prod-prop__title text-lg font-medium'>Compare</h4>
                        </div>
                        <div className='prod-prop flex gap-4 mt-7'>
                          <img src={buy} alt='' className='prod-prop__icon icon' />
                          <div>
                            <h4 className='prod-prop__title text-lg font-medium'>Delivery</h4>
                            <p className='prod-prop__desc mt-1 text-sm'>From $6 for 1-3 days</p>
                          </div>
                        </div>
                        <div className='prod-prop flex gap-4 mt-7'>
                          <img src={bag} alt='' className='prod-prop__icon icon' />
                          <div>
                            <h4 className='prod-prop__title text-lg font-medium'>Pickup</h4>
                            <p className='prod-prop__desc mt-1 text-sm'>Out of 2 store, today</p>
                          </div>
                        </div>
                        <div className='prod-info__card mt-7 p-5 rounded-md border border-solid border-gray-300'>
                          <div className='prod-info__row flex items-center'>
                            <span className='prod-info__price text-base font-medium'>
                              {formatCurrency(product.price)}đ
                            </span>
                            <span className='prod-info__tax py-1 px-2 ml-3 bg-[#67b04433] text-[#67b044] rounded text-sm font-medium'>
                              {rateScale(product.price, product.price_before_discount)}
                            </span>
                          </div>
                          <p className='prod-info__total-price my-5 mx-0 text-2xl font-medium'>
                            {formatCurrency(product.price_before_discount)}đ
                          </p>
                          <div className='flex items-center mb-4'>
                            <QuantityController
                              onIncrease={handleBuyCount}
                              onDecrease={handleBuyCount}
                              onType={handleBuyCount}
                              value={buyCount}
                              classNameWrapper={''}
                              max={product.quantity}
                            />
                            <div className='ml-3'>{product.quantity} gio hang</div>
                          </div>

                          <div className='prod-info__row flex items-center'>
                            <button
                              type='button'
                              onClick={buyNow}
                              className='btn btn--primary prod-info__add-to-cart h-[46px] w-full gap-3 rounded-md py-0 px-5 text-lg flex-1 bg-primary'
                            >
                              Buy Now
                            </button>
                            <button className='like-btn prod-info__like-btn flex items-center justify-center w-[46px] h-[46px] ml-5 rounded-md border border-solid border-gray-400 bg-transparent'>
                              <img src={heart} alt='' className='like-btn__icon icon' />
                              <img src='./assets/icons/heart-red.svg' alt='' className='like-btn__icon--liked' />
                            </button>
                          </div>
                          <button
                            type='button'
                            onClick={addToCart}
                            className='btn btn--primary prod-info__add-to-cart mt-2 h-[46px] w-full gap-3 rounded-md py-0 px-5 text-lg flex-1 bg-white border border-primary border-solid text-primary'
                          >
                            Add to cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </form>
            </div>
          </div>
        </div>

        <div className='product-container mt-8'>
          <div className='prod-tab js-tabs '>
            <ul className='prod-tab__list flex items-center my-0 -mx-8'>
              <li className='prod-tab__item prod-tab__item--current py-0 px-8 text-[#9e9da8] text-xl font-medium select-none whitespace-nowrap text-inherit'>
                Description
              </li>
              <li className='prod-tab__item py-0 px-8 text-[#9e9da8] text-xl font-medium select-none whitespace-nowrap cursor-pointer'>
                Review (1100)
              </li>
              <li className='prod-tab__item py-0 px-8 text-[#9e9da8] text-xl font-medium select-none whitespace-nowrap cursor-pointer'>
                Similar
              </li>
            </ul>
            <div className='prod-tab__contents pt-8 '>
              <div className='prod-tab__content prod-tab__content--current block'>
                <div className='row'>
                  <div className='col-8 col-xl-10 col-lg-12 w-1/2'>
                    <div
                      className='text-content prod-tab__text-content -mt-5 text-base'
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description) }}
                    />
                  </div>
                </div>
              </div>
              <div className='prod-tab__content hidden'>
                <div className='prod-content'>
                  <h2 className='prod-content__heading mb-8 text-xl font-semibold'>What our customers are saying</h2>
                  <div className='row row-cols-3 gx-lg-2 row-cols-md-1 gy-md-3'>
                    <div className='col'>
                      <div className='review-card'>
                        <div className='review-card__content'>
                          <img src='./assets/img/avatar/avatar.png' alt='' className='review-card__avatar' />
                          <div className='review-card__info'>
                            <h4 className='review-card__title'>Jakir Hussen</h4>
                            <p className='review-card__desc'>Great product, I love this Coffee Beans</p>
                          </div>
                        </div>
                        <div className='review-card__rating'>
                          <div className='review-card__star-list'>
                            <img src='./assets/icons/star.svg' alt='' className='review-card__star' />
                            <img src='./assets/icons/star.svg' alt='' className='review-card__star' />
                            <img src='./assets/icons/star.svg' alt='' className='review-card__star' />
                            <img src='./assets/icons/star-half.svg' alt='' className='review-card__star' />
                            <img src='./assets/icons/star-blank.svg' alt='' className='review-card__star' />
                          </div>
                          <span className='review-card__rating-title'>(3.5) Review</span>
                        </div>
                      </div>
                    </div>

                    <div className='col'>
                      <div className='review-card'>
                        <div className='review-card__content'>
                          <img src='./assets/img/avatar/avatar.png' alt='' className='review-card__avatar' />
                          <div className='review-card__info'>
                            <h4 className='review-card__title'>Jubed Ahmed</h4>
                            <p className='review-card__desc'>Awesome Coffee, I love this Coffee Beans</p>
                          </div>
                        </div>
                        <div className='review-card__rating'>
                          <div className='review-card__star-list'>
                            <img src='./assets/icons/star.svg' alt='' className='review-card__star' />
                            <img src='./assets/icons/star.svg' alt='' className='review-card__star' />
                            <img src='./assets/icons/star.svg' alt='' className='review-card__star' />
                            <img src='./assets/icons/star-half.svg' alt='' className='review-card__star' />
                            <img src='./assets/icons/star-blank.svg' alt='' className='review-card__star' />
                          </div>
                          <span className='review-card__rating-title'>(3.5) Review</span>
                        </div>
                      </div>
                    </div>

                    <div className='col'>
                      <div className='review-card'>
                        <div className='review-card__content'>
                          <img src='./assets/img/avatar/avatar.png' alt='' className='review-card__avatar' />
                          <div className='review-card__info'>
                            <h4 className='review-card__title'>Delwar Hussain</h4>
                            <p className='review-card__desc'>Great product, I like this Coffee Beans</p>
                          </div>
                        </div>
                        <div className='review-card__rating'>
                          <div className='review-card__star-list'>
                            <img src='./assets/icons/star.svg' alt='' className='review-card__star' />
                            <img src='./assets/icons/star.svg' alt='' className='review-card__star' />
                            <img src='./assets/icons/star.svg' alt='' className='review-card__star' />
                            <img src='./assets/icons/star-half.svg' alt='' className='review-card__star' />
                            <img src='./assets/icons/star-blank.svg' alt='' className='review-card__star' />
                          </div>
                          <span className='review-card__rating-title'>(3.5) Review</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='prod-tab__content hidden'>
                <div className='prod-content'>
                  <h2 className='prod-content__heading mb-8 text-xl font-normal'>Similar items you might like</h2>
                  <div className='row row-cols-6 row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-1 g-2'>
                    <div className='col'>
                      <article className='product-card'>
                        <div className='product-card__img-wrap'>
                          <a href='./product-detail.html'>
                            <img src='./assets/img/product/item-1.png' alt='' className='product-card__thumb' />
                          </a>
                          <button className='like-btn product-card__like-btn'>
                            <img src='./assets/icons/heart.svg' alt='' className='like-btn__icon icon' />
                            <img src='./assets/icons/heart-red.svg' alt='' className='like-btn__icon--liked' />
                          </button>
                        </div>
                        <h3 className='product-card__title'>
                          <a href='./product-detail.html'>Coffee Beans - Espresso Arabica and Robusta Beans</a>
                        </h3>
                        <p className='product-card__brand'>Lavazza</p>
                        <div className='product-card__row'>
                          <span className='product-card__price'>$47.00</span>
                          <img src='./assets/icons/star.svg' alt='' className='product-card__star' />
                          <span className='product-card__score'>4.3</span>
                        </div>
                      </article>
                    </div>

                    <div className='col'>
                      <article className='product-card'>
                        <div className='product-card__img-wrap'>
                          <a href='./product-detail.html'>
                            <img src='./assets/img/product/item-2.png' alt='' className='product-card__thumb' />
                          </a>
                          <button className='like-btn product-card__like-btn'>
                            <img src='./assets/icons/heart.svg' alt='' className='like-btn__icon icon' />
                            <img src='./assets/icons/heart-red.svg' alt='' className='like-btn__icon--liked' />
                          </button>
                        </div>
                        <h3 className='product-card__title'>
                          <a href='./product-detail.html'>Lavazza Coffee Blends - Try the Italian Espresso</a>
                        </h3>
                        <p className='product-card__brand'>Lavazza</p>
                        <div className='product-card__row'>
                          <span className='product-card__price'>$53.00</span>
                          <img src='./assets/icons/star.svg' alt='' className='product-card__star' />
                          <span className='product-card__score'>3.4</span>
                        </div>
                      </article>
                    </div>

                    <div className='col'>
                      <article className='product-card'>
                        <div className='product-card__img-wrap'>
                          <a href='./product-detail.html'>
                            <img src='./assets/img/product/item-3.png' alt='' className='product-card__thumb' />
                          </a>
                          <button className='like-btn like-btn--liked product-card__like-btn'>
                            <img src='./assets/icons/heart.svg' alt='' className='like-btn__icon icon' />
                            <img src='./assets/icons/heart-red.svg' alt='' className='like-btn__icon--liked' />
                          </button>
                        </div>
                        <h3 className='product-card__title'>
                          <a href='./product-detail.html'>Lavazza - Caffè Espresso Black Tin - Ground coffee</a>
                        </h3>
                        <p className='product-card__brand'>Welikecoffee</p>
                        <div className='product-card__row'>
                          <span className='product-card__price'>$99.99</span>
                          <img src='./assets/icons/star.svg' alt='' className='product-card__star' />
                          <span className='product-card__score'>5.0</span>
                        </div>
                      </article>
                    </div>

                    <div className='col'>
                      <article className='product-card'>
                        <div className='product-card__img-wrap'>
                          <a href='./product-detail.html'>
                            <img src='./assets/img/product/item-4.png' alt='' className='product-card__thumb' />
                          </a>
                          <button className='like-btn product-card__like-btn'>
                            <img src='./assets/icons/heart.svg' alt='' className='like-btn__icon icon' />
                            <img src='./assets/icons/heart-red.svg' alt='' className='like-btn__icon--liked' />
                          </button>
                        </div>
                        <h3 className='product-card__title'>
                          <a href='./product-detail.html'>Qualità Oro Mountain Grown - Espresso Coffee Beans</a>
                        </h3>
                        <p className='product-card__brand'>Lavazza</p>
                        <div className='product-card__row'>
                          <span className='product-card__price'>$38.65</span>
                          <img src='./assets/icons/star.svg' alt='' className='product-card__star' />
                          <span className='product-card__score'>4.4</span>
                        </div>
                      </article>
                    </div>

                    <div className='col'>
                      <article className='product-card'>
                        <div className='product-card__img-wrap'>
                          <a href='./product-detail.html'>
                            <img src='./assets/img/product/item-1.png' alt='' className='product-card__thumb' />
                          </a>
                          <button className='like-btn product-card__like-btn'>
                            <img src='./assets/icons/heart.svg' alt='' className='like-btn__icon icon' />
                            <img src='./assets/icons/heart-red.svg' alt='' className='like-btn__icon--liked' />
                          </button>
                        </div>
                        <h3 className='product-card__title'>
                          <a href='./product-detail.html'>Coffee Beans - Espresso Arabica and Robusta Beans</a>
                        </h3>
                        <p className='product-card__brand'>Lavazza</p>
                        <div className='product-card__row'>
                          <span className='product-card__price'>$47.00</span>
                          <img src='./assets/icons/star.svg' alt='' className='product-card__star' />
                          <span className='product-card__score'>4.3</span>
                        </div>
                      </article>
                    </div>

                    <div className='col'>
                      <article className='product-card'>
                        <div className='product-card__img-wrap'>
                          <a href='./product-detail.html'>
                            <img src='./assets/img/product/item-2.png' alt='' className='product-card__thumb' />
                          </a>
                          <button className='like-btn product-card__like-btn'>
                            <img src='./assets/icons/heart.svg' alt='' className='like-btn__icon icon' />
                            <img src='./assets/icons/heart-red.svg' alt='' className='like-btn__icon--liked' />
                          </button>
                        </div>
                        <h3 className='product-card__title'>
                          <a href='./product-detail.html'>Lavazza Coffee Blends - Try the Italian Espresso</a>
                        </h3>
                        <p className='product-card__brand'>Lavazza</p>
                        <div className='product-card__row'>
                          <span className='product-card__price'>$53.00</span>
                          <img src='./assets/icons/star.svg' alt='' className='product-card__star' />
                          <span className='product-card__score'>3.4</span>
                        </div>
                      </article>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='container'>
        <div className='title text-3xl font-medium mt-8'>CÓ THỂ BẠN CŨNG THÍCH</div>
        {productData && (
          <div className='row row-cols-4 row-cols-lg-2 row-cols-sm-1 g-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-7'>
            {productData.data.data.products.map((product) => (
              <div className='col-span-1' key={product._id}>
                <Product product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
