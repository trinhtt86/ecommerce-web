import { Link } from 'react-router-dom'
import heart from '../../../assets/icons/heart.svg'
import star from '../../../assets/icons/star.svg'
import { Product as ProductType } from 'src/types/product.type'
import { formatCurrency, generateNameId } from 'src/utils/utils'
import path from 'src/constants/path'

interface Props {
  product: ProductType
}
export default function Product({ product }: Props) {
  const productNameId = generateNameId({ name: product.name, id: product._id })
  return (
    <div className='product-card p-4 rounded-2xl bg-white'>
      <Link to={`${path.home}${productNameId}`}>
        <div className='product-card__img-wrap relative w-full pt-[100%]'>
          <div>
            <img
              src={product.image}
              alt={product.name}
              className='product-card__thumb absolute top-0 left-0 w-full h-full object-contain'
            />
          </div>
          <button className='like-btn product-card__like-btn flex items-center justify-center w-12 h-12 rounded-se-full shadow absolute right-0 bottom-0'>
            <img src={heart} alt='' className='like-btn__icon icon' />
            <img src='./assets/icons/heart-red.svg' alt='' className='like-btn__icon--liked' />
          </button>
        </div>
        <h3 className='product-card__title text-base font-normal mt-4 line-clamp-2'>
          <div>{product.name}</div>
        </h3>
        <p className='product-card__brand font-sm font-normal text-gray-300 my-4'>Lavazza</p>
        <div className='product-card__row flex items-center'>
          <span className='product-card__price text-base font-medium'>{formatCurrency(product.price)}đ</span>
          <img src={star} alt='' className='product-card__star mr-1 ml-auto' />
          <span className='product-card__score text-base font-medium'>{product.rating}</span>
        </div>
      </Link>
    </div>
  )
}
