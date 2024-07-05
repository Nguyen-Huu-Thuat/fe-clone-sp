import { FloatingPortal, arrow, useFloating, FloatingArrow, shift, type Placement } from '@floating-ui/react'
import { useRef, useState, useId, ElementType } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  children: React.ReactNode
  renderPopver: React.ReactNode
  className?: string
  as?: ElementType
  placement?: Placement
}
export default function Popover({ children, className, renderPopver, as: Element = 'div', placement }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const arrowRef = useRef(null)
  const id = useId()

  const { refs, floatingStyles, middlewareData, context } = useFloating({
    middleware: [
      shift(),
      arrow({
        element: arrowRef
      })
    ],
    placement: placement
  })

  const showPopover = () => {
    setIsOpen(true)
  }
  const hidePopover = () => {
    setIsOpen(false)
  }
  return (
    <Element className={className} ref={refs.setReference} onMouseEnter={showPopover} onMouseLeave={hidePopover}>
      {children}
      {isOpen && (
        <FloatingPortal id={id}>
          <AnimatePresence>
            <motion.div
              style={
                {
                  // transformOrigin: `${middlewareData.arrow?.x}px top`
                }
              }
              initial={{ opacity: 0, transform: 'scale(0) translateX(50%)' }}
              animate={{ opacity: 1, transform: 'scale(1) translateX(50%)' }}
              exit={{ opacity: 0, transform: 'scale(0) translateX(50%)' }}
              transition={{ duration: 0.3 }}
            >
              <div ref={refs.setFloating} style={floatingStyles}>
                <FloatingArrow
                  ref={arrowRef}
                  style={{
                    left: middlewareData.arrow?.x,
                    top: middlewareData.arrow?.y
                  }}
                  context={context}
                  className='border-x-transparent border-y-transparent border-b-red-500  absolute'
                  fill='white'
                />
                {renderPopver}
              </div>
            </motion.div>
          </AnimatePresence>
        </FloatingPortal>
      )}
    </Element>
  )
}
