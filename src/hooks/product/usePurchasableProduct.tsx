import { purchasableProduct } from '@/helper'
import { Product } from '@/types'
import { useEffect, useState } from 'react'
import { useUser } from '../user'

interface usePurchasableProductProps {
  product: Product
}

export const usePurchasableProduct = ({ product }: usePurchasableProductProps) => {
  const [isPurchasable, setIsPurchasable] = useState<boolean>(false)

  const { userInfo } = useUser({})

  useEffect(() => {
    setIsPurchasable(purchasableProduct(product, userInfo))
  }, [userInfo])

  return {
    isPurchasable,
  }
}
