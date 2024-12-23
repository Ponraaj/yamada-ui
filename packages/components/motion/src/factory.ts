import type { StyledOptions } from "@yamada-ui/core"
import type { ForwardRefExoticComponent } from "react"
import type { MotionAs, MotionComponents, MotionFactory } from "./motion.types"
import { styled } from "@yamada-ui/core"
import { motion as _motion } from "framer-motion"

interface Factory extends MotionFactory, MotionComponents {}

function factory() {
  const cache = new Map<MotionAs, ForwardRefExoticComponent<any>>()

  return new Proxy(styled, {
    apply: (_target, _thisArg, [el, options]: [MotionAs, StyledOptions]) => {
      return _motion(styled(el, options) as ForwardRefExoticComponent<any>)
    },

    get: (_target, el: MotionAs) => {
      if (!cache.has(el))
        cache.set(el, _motion(styled(el) as ForwardRefExoticComponent<any>))

      return cache.get(el)
    },
  }) as Factory
}

/**
 * `motion` is a component that allows for the easy implementation of a wide variety of animations.
 *
 * @see Docs https://yamada-ui.com/components/other/motion
 */
export const motion = factory()
