// import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { Link, createSearchParams } from 'react-router-dom'
import path from 'src/constants/path'
import { QueryConfig } from 'src/hooks/useQueryConfig'
interface Props {
  queryConfig: QueryConfig
  pageSize: number
}
const RANGE = 2
export default function Pagination({ queryConfig, pageSize }: Props) {
  const page = Number(queryConfig.page)
  const renderPagination = () => {
    let dotAfter = false
    let dotBefore = false
    const renderDotBefore = (index: number) => {
      if (!dotBefore) {
        dotBefore = true
        return (
          <span key={index} className='bg-white rounded px-3 py-2 shadow-sm mx-2 cursor-pointer '>
            ...
          </span>
        )
      }
    }
    const renderDotAfter = (index: number) => {
      if (!dotAfter) {
        dotAfter = true
        return (
          <span key={index} className='bg-white rounded px-3 py-2 shadow-sm mx-2 cursor-pointer '>
            ...
          </span>
        )
      }
      return null
    }
    return Array(pageSize)
      .fill(0)
      .map((_, index) => {
        const pageNum = index + 1
        if (page <= RANGE * 2 + 1 && pageNum > page + RANGE && pageNum < pageSize - RANGE + 1) {
          return renderDotAfter(index)
        } else if (page > RANGE * 2 + 1 && page < pageSize - RANGE * 2) {
          if (pageNum < page - RANGE && pageNum > RANGE) {
            return renderDotBefore(index)
          } else if (pageNum > page + RANGE && pageNum < pageSize - RANGE + 1) {
            return renderDotAfter(index)
          }
        } else if (page >= pageSize - RANGE * 2 && pageNum > RANGE && pageNum < page - RANGE) {
          return renderDotBefore(index)
        }

        const buttonClass = classNames({
          'bg-white': true,
          rounded: true,
          'px-3': true,
          'py-2': true,
          'shadow-sm': true,
          'mx-2': true,
          'cursor-pointer': true,
          'text-orange-800': page === pageNum
        })
        return (
          <Link
            to={{
              pathname: path.home,
              search: createSearchParams({
                ...queryConfig,
                page: pageNum.toString()
              }).toString()
            }}
            key={index}
            className={buttonClass}
          >
            {pageNum}
          </Link>
        )
      })
  }
  return (
    <div className='flex flex-wrap mt-6 justify-center'>
      {page === 1 ? (
        <span className='bg-white/60 rounded px-3 py-2 shadow-sm mx-2 cursor-not-allowed '>Prev</span>
      ) : (
        <Link
          to={{
            pathname: path.home,
            search: createSearchParams({
              ...queryConfig,
              page: (page - 1).toString()
            }).toString()
          }}
          className='bg-white rounded px-3 py-2 shadow-sm mx-2 cursor-pointer '
        >
          Prev
        </Link>
      )}

      {renderPagination()}
      {page === pageSize ? (
        <span className='bg-white/50 rounded px-3 py-2 shadow-sm mx-2 cursor-not-allowed '>Next</span>
      ) : (
        <Link
          to={{
            pathname: path.home,
            search: createSearchParams({
              ...queryConfig,
              page: (page + 1).toString()
            }).toString()
          }}
          className='bg-white rounded px-3 py-2 shadow-sm mx-2 cursor-pointer '
        >
          Next
        </Link>
      )}
    </div>
  )
}
