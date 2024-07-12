import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFloating, FloatingPortal, arrow, offset, shift, FloatingArrow, Placement } from '@floating-ui/react'
interface Props {
  children: React.ReactNode
  renderPopover: React.ReactNode
  className?: string
  placement: Placement
}
export default function Popover({ children, className, renderPopover }: Props) {
  const arrowRef = useRef(null)
  const { refs, floatingStyles, context, middlewareData } = useFloating({
    placement: 'bottom-end',
    middleware: [offset(10), shift(), arrow({ element: arrowRef })]
  })
  const [isOpen, setIsOpen] = useState(true)
  const showPopover = () => {
    setIsOpen(true)
  }
  const hidePopover = () => {
    setIsOpen(false)
  }
  return (
    <button ref={refs.setReference} className={className} onMouseEnter={showPopover} onMouseLeave={hidePopover}>
      {children}
      <FloatingPortal>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              ref={refs.setFloating}
              style={floatingStyles}
              className='bg-white shadow-md rounded-sm border border-gray-200'
            >
              <FloatingArrow
                ref={arrowRef}
                context={context}
                className='
                    fill-white 
                    [&>path:first-of-type]:stroke-pink-500
                    [&>path:last-of-type]:stroke-white
                  '
                style={{
                  position: 'absolute',
                  top: middlewareData.arrow?.y ?? '',
                  left: middlewareData.arrow?.x ?? ''
                }}
              />
              {renderPopover}
            </motion.div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </button>
  )
}
