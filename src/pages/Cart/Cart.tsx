import { useMutation, useQuery } from '@tanstack/react-query'
import purchaseApi from 'src/apis/purchase.api'
import { purchasesStatus } from 'src/constants/purchase'
import arrowR from 'src/assets/icons/arrow-right.svg'
import { Link, useLocation } from 'react-router-dom'
import arrowD from 'src/assets/icons/arrow-down.svg'

import heart2 from 'src/assets/icons/heart-2.svg'
import trash from 'src/assets/icons/trash.svg'
import gift from 'src/assets/icons/gift-2.svg'

import path from 'src/constants/path'
import Button from 'src/components/Button'
import { formatCurrency, generateNameId } from 'src/utils/utils'
import QuantityController from 'src/components/QuantityController'
import React, { useContext, useEffect, useMemo } from 'react'
import { Purchase } from 'src/types/purchase.type'
import { produce } from 'immer'
import keyBy from 'lodash/keyBy'
import { toast } from 'react-toastify'
import { AppContext } from 'src/contexts/app.context'

export default function Cart() {
  const { extendedPurchases, setExtendedPurchases } = useContext(AppContext)

  const { data: purchaseInCartData, refetch } = useQuery({
    queryKey: ['purchases', { status: purchasesStatus.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchasesStatus.inCart })
  })
  const updatePurchaseMutation = useMutation({
    mutationFn: purchaseApi.updatePurchase,
    onSuccess: () => {
      refetch()
    }
  })
  const buyProductMutation = useMutation({
    mutationFn: purchaseApi.buyProducts,
    onSuccess: (data) => {
      refetch()
      toast.success(data.data.message)
    }
  })
  const deletePurchasesMutation = useMutation({
    mutationFn: purchaseApi.deletePurchase,
    onSuccess: () => {
      refetch()
    }
  })

  const location = useLocation()
  const choosenPurchaseId = (location.state as { purchaseId: string } | null)?.purchaseId
  const purchaseInCart = purchaseInCartData?.data.data
  const isAllChecked = useMemo(() => extendedPurchases.every((purchase) => purchase.checked), [extendedPurchases])
  const checkedPurchases = useMemo(() => extendedPurchases.filter((purchase) => purchase.checked), [extendedPurchases])
  const checkedPurchasesCount = checkedPurchases.length
  const totalCheckedPurchasePrice = useMemo(
    () =>
      checkedPurchases.reduce((result, current) => {
        return result + current.product.price * current.buy_count
      }, 0),
    [checkedPurchases]
  )

  useEffect(() => {
    setExtendedPurchases((prev) => {
      const extendedPurchasesObject = keyBy(prev, '_id')
      return (
        purchaseInCart?.map((purchase) => {
          const isChoosenPurchaseId = choosenPurchaseId === purchase._id
          return {
            ...purchase,
            disabled: false,
            checked: isChoosenPurchaseId || Boolean(extendedPurchasesObject[purchase._id]?.checked)
          }
        }) || []
      )
    })
  }, [purchaseInCart, choosenPurchaseId, setExtendedPurchases])

  useEffect(() => {
    return () => {
      history.replaceState(null, '')
    }
  })

  const handleCheck = (purchaseIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].checked = event.target.checked
      })
    )
  }
  const handleCheckAll = () => {
    setExtendedPurchases((prev) =>
      prev.map((purchase) => ({
        ...purchase,
        checked: !isAllChecked
      }))
    )
  }
  const handleTypeQuantity = (purchaseIndex: number) => (value: number) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].buy_count = value
      })
    )
  }
  const handleQuantity = (purchaseIndex: number, value: number, enable: boolean) => {
    if (enable) {
      const purchase = extendedPurchases[purchaseIndex]
      setExtendedPurchases(
        produce((draft) => {
          draft[purchaseIndex].disabled = true
        })
      )
      updatePurchaseMutation.mutate({ product_id: purchase.product._id, buy_count: value })
    }
  }
  const handleDelete = (purchaseIndex: number) => () => {
    const purchaseId = extendedPurchases[purchaseIndex]._id
    deletePurchasesMutation.mutate([purchaseId])
  }

  const handleDeleteManyPurchases = () => {
    const purchaseIds = checkedPurchases.map((purchase) => purchase._id)
    deletePurchasesMutation.mutate(purchaseIds)
  }
  const handleByProduct = () => {
    if (checkedPurchases.length > 0) {
      const body = checkedPurchases.map((purchase) => ({
        product_id: purchase.product._id,
        buy_count: purchase.buy_count
      }))
      buyProductMutation.mutate(body)
    }
  }
  return (
    <main className='checkout-page   flex flex-col min-h-[80vh]  '>
      <div className='container '>
        <div className='checkout-container mt-8 '>
          <ul className='breadcrumbs checkout-page__breadcrumbs bg-white flex flex-wrap items-center gap-7 min-h-[64px] p-5 rounded-xl shadow'>
            <li>
              <a
                href='./'
                className='breadcrumbs__link flex flex-wrap gap-2 text-[#9e9da8] text-base font-medium whitespace-nowrap'
              >
                Home
                <img src={arrowR} alt='' />
              </a>
            </li>
            <li>
              <a
                href='#!'
                className='breadcrumbs__link breadcrumbs__link--current flex flex-wrap gap-2 text-[#9e9da8] text-base font-medium whitespace-nowrap breadcrumbs__link--current text-inherit'
              >
                Checkout
              </a>
            </li>
          </ul>
        </div>
        {extendedPurchases.length > 0 ? (
          <div className='checkout-container mt-8 '>
            <div className='row gy-xl-3 grid grid-cols-12'>
              <div className='col-8 col-xl-12 col-span-8'>
                <div className='cart-info p-8 rounded-2xl bg-white shadow-md'>
                  <h1 className='cart-info__heading'>Favourite List</h1>
                  <p className='cart-info__desc'>{extendedPurchases.length} items</p>
                  <div className='cart-info__check-all'>
                    <div className='cart-info__checkbox'>
                      <input
                        checked={isAllChecked}
                        onChange={handleCheckAll}
                        type='checkbox'
                        name='shipping-adress'
                        className='cart-info__checkbox-input'
                      />
                      <button
                        onClick={handleDeleteManyPurchases}
                        className='cart-item__ctrl-btn js-toggle flex items-center gap-3 text-base font-medium text-[#9e9da8] ml-3'
                      >
                        <img src={trash} alt='' />
                        xoa
                      </button>
                    </div>
                  </div>
                  <div className='cart-info__list -mt-8'>
                    {extendedPurchases?.map((purchase, index) => (
                      <article key={purchase._id} className='cart-item flex gap-7 py-8 px-0 border-b border-[#d2d1d6]'>
                        <div className='cart-info__checkbox'>
                          <input
                            checked={purchase.checked}
                            onChange={handleCheck(index)}
                            type='checkbox'
                            name='shipping-adress'
                            className='cart-info__checkbox-input'
                          />
                        </div>
                        <Link
                          to={`${path.home}${generateNameId({ name: purchase.product.name, id: purchase.product._id })}`}
                        >
                          <img
                            src={purchase.product.image}
                            alt=''
                            className='cart-item__thumb w-[172px] h-[172px] object-contain'
                          />
                        </Link>
                        <div className='cart-item__content flex-1 flex self-start'>
                          <div className='cart-item__content-left flex-1'>
                            <h3 className='cart-item__title text-lg font-medium max-w-[374px]'>
                              <Link
                                className='line-clamp-2'
                                to={`${path.home}${generateNameId({ name: purchase.product.name, id: purchase.product._id })}`}
                              >
                                {purchase.product.name}
                              </Link>
                            </h3>
                            <p className='cart-item__price-wrap my-4 text-[#9e9da8] text-lg font-medium'>
                              {formatCurrency(purchase.product.price)}đ |{' '}
                              <span className='cart-item__status text-[#67b044]'>In Stock</span>
                            </p>
                            <div className='cart-item__ctrl cart-item__ctrl--md-block flex items-center gap-5'>
                              <div className='cart-item__input flex items-center h-[44px] px-5 gap-3 rounded-xl border border-solid border-[#d2d1d6] text-sm font-medium'>
                                LavAzza
                                <img className='icon ' src={arrowD} alt='' />
                              </div>
                              <QuantityController
                                onFocusOut={(value) =>
                                  handleQuantity(
                                    index,
                                    value,
                                    value >= 1 &&
                                      value <= purchase.product.quantity &&
                                      value !== (purchaseInCart as Purchase[])[index].buy_count
                                  )
                                }
                                onType={handleTypeQuantity(index)}
                                onIncrease={(value) => handleQuantity(index, value, value <= purchase.product.quantity)}
                                onDecrease={(value) => handleQuantity(index, value, value >= 1)}
                                disabled={purchase.disabled}
                                max={purchase.product.quantity}
                                value={purchase.buy_count}
                              />
                            </div>
                          </div>
                          <div className='cart-item__content-right flex flex-col '>
                            <p className='cart-item__total-price text-xl font-bold text-right'>
                              {formatCurrency(purchase.product.price * purchase.buy_count)}đ
                            </p>
                            <div className='cart-item__ctrl flex items-center gap-5 mt-auto min-h-[44px]'>
                              <button className='cart-item__ctrl-btn flex items-center gap-3 text-base font-medium text-[#9e9da8]'>
                                <img src={heart2} alt='' />
                                Save
                              </button>
                              <button
                                onClick={handleDelete(index)}
                                className='cart-item__ctrl-btn js-toggle flex items-center gap-3 text-base font-medium text-[#9e9da8] ml-3'
                              >
                                <img src={trash} alt='' />
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                  <div className='cart-info__bottom d-md-none mt-8'>
                    <div className='row grid grid-cols-12'>
                      <div className='col-8 col-xxl-7 col-span-8'>
                        <div className='cart-info__continue h-full flex items-end'>
                          <Link
                            to={path.home}
                            className='cart-info__continue-link flex items-center gap-3 text-lg font-medium'
                          >
                            <img className='cart-info__continue-icon icon rotate-90' src={arrowD} alt='' />
                            Continue Shopping
                          </Link>
                        </div>
                      </div>
                      <div className='col-4 col-xxl-5 col-span-4'>
                        <div className='cart-info__row flex items-center justify-between text-lg font-medium mt-3'>
                          <span>Subtotal:</span>
                          <span>$191.65</span>
                        </div>
                        <div className='cart-info__row flex items-center justify-between text-lg font-medium mt-3'>
                          <span>Shipping:</span>
                          <span>$10.00</span>
                        </div>
                        <div className='cart-info__separate my-8 mx-0 h-[1px] bg-[#d2d1d6]'></div>
                        <div className='cart-info__row flex items-center justify-between text-2xl font-bold mt-3 cart-info__row--bold'>
                          <span>Total:</span>
                          <span>{formatCurrency(totalCheckedPurchasePrice)}đ</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-4 col-xl-12 col-span-4'>
                <div className='cart-info p-8 rounded-2xl bg-white shadow-md'>
                  <div className='cart-info__row flex items-center justify-between text-lg font-medium mt-3'>
                    <span>
                      Subtotal <span className='cart-info__sub-label font-normal'>(items)</span>
                    </span>
                    <span>{checkedPurchasesCount}</span>
                  </div>
                  <div className='cart-info__row flex items-center justify-between text-lg font-medium mt-3'>
                    <span>
                      Price <span className='cart-info__sub-label font-normal'>(Total)</span>
                    </span>
                    <span>$191.65</span>
                  </div>
                  <div className='cart-info__row flex items-center justify-between text-lg font-medium mt-3'>
                    <span>Shipping</span>
                    <span>$10.00</span>
                  </div>
                  <div className='cart-info__separate my-8 mx-0 h-[1px] bg-[#d2d1d6]'></div>
                  <div className='cart-info__row flex items-center justify-between text-lg font-medium mt-3'>
                    <span>Estimated Total</span>
                    <span>$201.65</span>
                  </div>
                  <Button
                    onClick={handleByProduct}
                    // disabled={buyProductMutation.isLoading}
                    className='cart-info__next-btn btn btn--primary btn--rounded mt-8 text-zinc-950 bg-primary  h-11 py-0 px-5 rounded-full  text-base  font-medium whitespace-nowrap  hover:opacity-90 w-full'
                  >
                    Continue to checkout
                  </Button>
                </div>
                <div className='cart-info mt-8 p-8 rounded-2xl bg-white shadow-md'>
                  <a href='#!'>
                    <article className='gift-item flex gap-5'>
                      <div className='gift-item__icon-wrap shrink-0 flex items-center justify-center w-[76px] h-[76px]  rounded-xl bg-[#7644e11a] shadow-violet-400'>
                        <img src={gift} alt='' className='gift-item__icon' />
                      </div>
                      <div className='gift-item__content'>
                        <h3 className='gift-item__title text-lg font-medium'>Send this order as a gift.</h3>
                        <p className='gift-item__desc text-sm font-normal mt-3'>
                          Available items will be shipped to your gift recipient.
                        </p>
                      </div>
                    </article>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Link to={path.home}>khofgifd</Link>
        )}
      </div>
    </main>
  )
}
