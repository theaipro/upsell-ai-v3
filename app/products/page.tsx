"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { Plus, Search, Edit, Trash2, Star, DollarSign, Package } from "lucide-react"
import { FloatingSidebar } from "@/components/floating-sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  ChevronDown,
  ChevronUp,
  Tag,
  Percent,
  Truck,
  Ticket,
  Pizza,
  Coffee,
  Utensils,
  Dessert,
  X,
  Save,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Product {
  id: string
  company_id: string
  name: string
  description: string
  price: number
  category: string
  category_id?: string
  image_url: string
  is_available: boolean
  is_featured: boolean
  preparation_time: number
  calories: number
  protein: number
  carbs: number
  fat: number
  tags: string[]
  ingredients: string[]
  allergens: string[]
  dietary_info: string[]
  variants: any
  sort_order: number
  created_at: string
  updated_at: string
}

interface ProductAnalytics {
  id: string
  product_id: string
  company_id: string
  analysis_date: string
  daily_revenue: number
  daily_sales_count: number
  daily_orders_containing_product: number
  daily_favorites: number
  daily_combo_added: number
  daily_price_ask: number
}

interface ImportedItem {
  id: string
  type: "product" | "subscription" | "offer"
  name: string
  description: string
  price?: number
  category?: string
  confidence: number
  selected: boolean
  rawData: any
}

interface Subscription {
  id: string
  company_id: string
  name: string
  description: string
  price: number
  billing_cycle: string
  features: string[]
  popular: boolean
  active: boolean
  category: string
  trial_days?: number
  setup_fee?: number
  created_at: string
  updated_at: string
}

interface Offer {
  id: string
  company_id: string
  name: string
  description: string
  type: string
  value: string
  code?: string
  start_date: string
  end_date: string
  active: boolean
  applies_to: string
  applies_to_value?: string
  min_order_value: number
  buy_products: { productId: string; quantity: number }[]
  get_products: { productId: string; quantity: number }[]
  buy_quantity: number
  get_quantity: number
  created_at: string
  updated_at: string
}

const categoryIcons: Record<string, React.ElementType> = {
  Pizza: Pizza,
  Salad: Utensils,
  Beverage: Coffee,
  Dessert: Dessert,
}

const offerTypeConfig = {
  discount: { label: "Discount", icon: Percent, color: "bg-green-100 text-green-800 border-green-200" },
  freeItem: { label: "Free Item", icon: Tag, color: "bg-blue-100 text-blue-800 border-blue-200" },
  freeDelivery: { label: "Free Delivery", icon: Truck, color: "bg-purple-100 text-purple-800 border-purple-200" },
  coupon: { label: "Coupon", icon: Ticket, color: "bg-orange-100 text-orange-800 border-orange-200" },
  buyXGetY: { label: "Buy X Get Y", icon: Tag, color: "bg-pink-100 text-pink-800 border-pink-200" },
}

const emptyProduct: Omit<Product, "id" | "company_id" | "created_at" | "updated_at"> = {
  name: "",
  description: "",
  price: 0,
  category: "",
  image_url: "",
  is_available: true,
  is_featured: false,
  preparation_time: 0,
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  tags: [],
  ingredients: [],
  allergens: [],
  dietary_info: [],
  variants: {},
  sort_order: 0,
}

const emptyOffer: Omit<Offer, "id" | "company_id" | "created_at" | "updated_at"> = {
  name: "",
  description: "",
  type: "discount",
  value: "",
  start_date: new Date().toISOString().split("T")[0],
  end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split("T")[0],
  active: true,
  applies_to: "all",
  min_order_value: 0,
  buy_products: [],
  get_products: [],
  buy_quantity: 1,
  get_quantity: 1,
}

const emptySubscription: Omit<Subscription, "id" | "company_id" | "created_at" | "updated_at"> = {
  name: "",
  description: "",
  price: 0,
  billing_cycle: "monthly",
  features: [],
  popular: false,
  active: true,
  category: "",
}

const ProductForm = React.memo(
  ({
    product,
    setProduct,
    categories,
    setIsAddCategoryDialogOpen,
  }: {
    product: Product | Omit<Product, "id">
    setProduct: (p: any) => void
    categories: Array<{ id: string; name: string }>
    setIsAddCategoryDialogOpen: (open: boolean) => void
  }) => {
    const [tagInput, setTagInput] = useState("")
    const [ingredientInput, setIngredientInput] = useState("")
    const [showAdvanced, setShowAdvanced] = useState(false)

    const addTag = () => {
      if (tagInput.trim()) {
        setProduct((prev: any) => ({
          ...prev,
          tags: [...(prev.tags || []), tagInput.trim()],
        }))
        setTagInput("")
      }
    }

    const removeTag = (index: number) => {
      setProduct((prev: any) => ({
        ...prev,
        tags: prev.tags.filter((_: any, i: number) => i !== index),
      }))
    }

    const addIngredient = () => {
      if (ingredientInput.trim()) {
        setProduct((prev: any) => ({
          ...prev,
          ingredients: [...(prev.ingredients || []), ingredientInput.trim()],
        }))
        setIngredientInput("")
      }
    }

    const removeIngredient = (index: number) => {
      setProduct((prev: any) => ({
        ...prev,
        ingredients: prev.ingredients?.filter((_: any, i: number) => i !== index),
      }))
    }

    return (
      <div className="space-y-4">
        {/* Basic Information */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              placeholder="Margherita Pizza"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={product.price}
              onChange={(e) => setProduct({ ...product, price: Number.parseFloat(e.target.value) || 0 })}
              placeholder="12.99"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={product.description}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
            placeholder="Describe your product..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={(product as Product).category_id}
              onValueChange={(value) => {
                if (value === "new-category") {
                  setIsAddCategoryDialogOpen(true)
                } else {
                  setProduct({ ...product, category_id: value })
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
                <SelectItem value="new-category" className="text-upsell-blue font-medium">
                  <div className="flex items-center gap-2">
                    <Plus size={16} />
                    New Category
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <div className="flex items-center justify-between pt-2">
              <div className="space-y-0.5">
                <Label htmlFor="available" className="text-base">
                  Available
                </Label>
                <p className="text-xs text-gray-500">Show this product to customers</p>
              </div>
              <Switch
                id="available"
                checked={(product as Product).is_available}
                onCheckedChange={(checked) => setProduct({ ...product, is_available: checked })}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Popular Item</Label>
            <Switch
              checked={(product as Product).is_featured}
              onCheckedChange={(checked) => setProduct({ ...product, is_featured: checked })}
            />
          </div>
          <p className="text-xs text-gray-500">Mark this as a popular item to highlight it to customers</p>
        </div>

        {/* Advanced Product Information */}
        <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between bg-transparent">
              Advanced Product Information
              {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add tag..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                />
                <Button type="button" onClick={addTag} size="sm">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(product.tags || []).map((tag, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {tag}
                    <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => removeTag(index)} />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Ingredients</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={ingredientInput}
                  onChange={(e) => setIngredientInput(e.target.value)}
                  placeholder="Add ingredient..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addIngredient()
                    }
                  }}
                />
                <Button type="button" onClick={addIngredient} size="sm">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(product.ingredients || []).map((ingredient, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {ingredient}
                    <X
                      size={12}
                      className="cursor-pointer hover:text-red-500"
                      onClick={() => removeIngredient(index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Nutritional Information</Label>
              <div className="grid grid-cols-4 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="calories" className="text-xs">
                    Calories
                  </Label>
                  <Input
                    id="calories"
                    type="number"
                    value={product.calories || 0}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        calories: Number.parseInt(e.target.value) || 0,
                      })
                    }
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="protein" className="text-xs">
                    Protein (g)
                  </Label>
                  <Input
                    id="protein"
                    type="number"
                    value={product.protein || 0}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        protein: Number.parseInt(e.target.value) || 0,
                      })
                    }
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="carbs" className="text-xs">
                    Carbs (g)
                  </Label>
                  <Input
                    id="carbs"
                    type="number"
                    value={product.carbs || 0}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        carbs: Number.parseInt(e.target.value) || 0,
                      })
                    }
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="fat" className="text-xs">
                    Fat (g)
                  </Label>
                  <Input
                    id="fat"
                    type="number"
                    value={product.fat || 0}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        fat: Number.parseInt(e.target.value) || 0,
                      })
                    }
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    )
  },
)

const OfferForm = React.memo(
  ({
    offer,
    setOffer,
    products,
    categories,
  }: {
    offer: Offer | Omit<Offer, "id">
    setOffer: (o: any) => void
    products: Product[]
    categories: string[]
  }) => {
    const [showAdvanced, setShowAdvanced] = useState(false)

    const addBuyProduct = (productId: string) => {
      setOffer((prevOffer: any) => {
        const existingProduct = prevOffer.buy_products?.find((item: any) => item.productId === productId)
        if (existingProduct) {
          return {
            ...prevOffer,
            buy_products: prevOffer.buy_products?.map((item: any) =>
              item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
            ),
          }
        } else {
          return {
            ...prevOffer,
            buy_products: [...(prevOffer.buy_products || []), { productId, quantity: 1 }],
          }
        }
      })
    }

    const addGetProduct = (productId: string) => {
      setOffer((prevOffer: any) => {
        const existingProduct = prevOffer.get_products?.find((item: any) => item.productId === productId)
        if (existingProduct) {
          return {
            ...prevOffer,
            get_products: prevOffer.get_products?.map((item: any) =>
              item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
            ),
          }
        } else {
          return {
            ...prevOffer,
            get_products: [...(prevOffer.get_products || []), { productId, quantity: 1 }],
          }
        }
      })
    }

    return (
      <div className="space-y-4">
        {/* Basic Information */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Offer Name</Label>
            <Input
              id="name"
              value={offer.name}
              onChange={(e) => setOffer({ ...offer, name: e.target.value })}
              placeholder="Summer Special"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Offer Type</Label>
            <Select value={offer.type} onValueChange={(value: any) => setOffer({ ...offer, type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="discount">Discount</SelectItem>
                <SelectItem value="freeItem">Free Item</SelectItem>
                <SelectItem value="buyXGetY">Buy X Get Y</SelectItem>
                <SelectItem value="freeDelivery">Free Delivery</SelectItem>
                <SelectItem value="coupon">Coupon</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={offer.description}
            onChange={(e) => setOffer({ ...offer, description: e.target.value })}
            placeholder="Describe your offer..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="value">
              {offer.type === "discount"
                ? "Discount Percentage"
                : offer.type === "freeItem"
                  ? "Number of Free Items"
                  : "Value"}
            </Label>
            <Input
              id="value"
              value={offer.value}
              onChange={(e) => setOffer({ ...offer, value: e.target.value })}
              placeholder={offer.type === "discount" ? "20" : "1"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="code">Promo Code (Optional)</Label>
            <Input
              id="code"
              value={offer.code || ""}
              onChange={(e) => setOffer({ ...offer, code: e.target.value })}
              placeholder="SUMMER20"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={offer.start_date}
              onChange={(e) => setOffer({ ...offer, start_date: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={offer.end_date}
              onChange={(e) => setOffer({ ...offer, end_date: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Active</Label>
            <Switch checked={offer.active} onCheckedChange={(checked) => setOffer({ ...offer, active: checked })} />
          </div>
        </div>

        {/* Advanced Offer Settings */}
        <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between bg-transparent">
              Advanced Offer Settings
              {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="appliesTo">Applies To</Label>
              <Select
                value={offer.applies_to}
                onValueChange={(value: any) => setOffer({ ...offer, applies_to: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="category">Specific Category</SelectItem>
                  <SelectItem value="specific">Specific Product</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {offer.applies_to === "category" && (
              <div className="space-y-2">
                <Label htmlFor="appliesToValue">Category</Label>
                <Select
                  value={offer.applies_to_value || ""}
                  onValueChange={(value) => setOffer({ ...offer, applies_to_value: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {offer.applies_to === "specific" && (
              <div className="space-y-2">
                <Label htmlFor="appliesToValue">Product</Label>
                <Select
                  value={offer.applies_to_value || ""}
                  onValueChange={(value) => setOffer({ ...offer, applies_to_value: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="minOrderValue">Minimum Order Value ($)</Label>
              <Input
                id="minOrderValue"
                type="number"
                step="0.01"
                value={offer.min_order_value || 0}
                onChange={(e) => setOffer({ ...offer, min_order_value: Number.parseFloat(e.target.value) || 0 })}
                placeholder="25.00"
              />
              <p className="text-xs text-gray-500">Set to 0 for no minimum</p>
            </div>

            {(offer.type === "freeItem" || offer.type === "buyXGetY") && (
              <div className="space-y-4">
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">Product Selection</h4>
                  {offer.type === "buyXGetY" && (
                    <>
                      <div className="space-y-3">
                        <Label>Buy These Products:</Label>
                        <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded p-2">
                          {products.map((product) => (
                            <Button
                              key={product.id}
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addBuyProduct(product.id)}
                              className="justify-start text-xs"
                            >
                              {product.name}
                            </Button>
                          ))}
                        </div>
                        {offer.buy_products && offer.buy_products.length > 0 && (
                          <div className="space-y-2">
                            <Label className="text-sm">Selected Buy Products:</Label>
                            {offer.buy_products.map((item, index) => {
                              const product = products.find((p) => p.id === item.productId)
                              return (
                                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                  <span className="text-sm">
                                    {product?.name} x{item.quantity}
                                  </span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      setOffer({
                                        ...offer,
                                        buy_products: offer.buy_products?.filter((_, i) => i !== index),
                                      })
                                    }
                                  >
                                    <X size={14} />
                                  </Button>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  <div className="space-y-3">
                    <Label>Get These Products {offer.type === "freeItem" ? "Free" : ""}:</Label>
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded p-2">
                      {products.map((product) => (
                        <Button
                          key={product.id}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addGetProduct(product.id)}
                          className="justify-start text-xs"
                        >
                          {product.name}
                        </Button>
                      ))}
                    </div>
                    {offer.get_products && offer.get_products.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm">Selected Get Products:</Label>
                        {offer.get_products.map((item, index) => {
                          const product = products.find((p) => p.id === item.productId)
                          return (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                              <span className="text-sm">
                                {product?.name} x{item.quantity}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  setOffer({
                                    ...offer,
                                    get_products: offer.get_products?.filter((_, i) => i !== index),
                                  })
                                }
                              >
                                <X size={14} />
                              </Button>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>
    )
  },
)

const SubscriptionForm = React.memo(
  ({
    subscription,
    setSubscription,
    categories,
  }: {
    subscription: Subscription | Omit<Subscription, "id">
    setSubscription: (s: any) => void
    categories: any[] // Updated type to handle category objects
  }) => {
    const [featureInput, setFeatureInput] = useState("")
    const [showAdvanced, setShowAdvanced] = useState(false)

    const addFeature = () => {
      if (featureInput.trim()) {
        setSubscription((prev: any) => ({
          ...prev,
          features: [...prev.features, featureInput.trim()],
        }))
        setFeatureInput("")
      }
    }

    const removeFeature = (index: number) => {
      setSubscription((prev: any) => ({
        ...prev,
        features: prev.features.filter((_: any, i: number) => i !== index),
      }))
    }

    return (
      <div className="space-y-4">
        {/* Basic Information */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sub-name">Subscription Name</Label>
            <Input
              id="sub-name"
              value={subscription.name}
              onChange={(e) => setSubscription({ ...subscription, name: e.target.value })}
              placeholder="Premium Coffee Club"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sub-price">Price ($)</Label>
            <Input
              id="sub-price"
              type="number"
              step="0.01"
              value={subscription.price}
              onChange={(e) => setSubscription({ ...subscription, price: Number.parseFloat(e.target.value) || 0 })}
              placeholder="29.99"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sub-description">Description</Label>
          <Textarea
            id="sub-description"
            value={subscription.description}
            onChange={(e) => setSubscription({ ...subscription, description: e.target.value })}
            placeholder="Describe your subscription..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sub-billing">Billing Cycle</Label>
            <Select
              value={subscription.billing_cycle}
              onValueChange={(value: any) => setSubscription({ ...subscription, billing_cycle: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sub-category">Category</Label>
            <Select
              value={subscription.category}
              onValueChange={(value) => setSubscription({ ...subscription, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem
                    key={typeof category === "string" ? category : category.id}
                    value={typeof category === "string" ? category : category.name}
                  >
                    {typeof category === "string" ? category : category.name}
                  </SelectItem>
                ))}
                <SelectItem value="new-category">
                  <div className="flex items-center gap-2">
                    <Plus size={16} />
                    New Category
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Active</Label>
            <Switch
              checked={subscription.active}
              onCheckedChange={(checked) => setSubscription({ ...subscription, active: checked })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Popular</Label>
            <Switch
              checked={subscription.popular}
              onCheckedChange={(checked) => setSubscription({ ...subscription, popular: checked })}
            />
          </div>
          <p className="text-xs text-gray-500">Mark this as a popular subscription to highlight it</p>
        </div>

        <div className="space-y-2">
          <Label>Features</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              placeholder="Add feature..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addFeature()
                }
              }}
            />
            <Button type="button" onClick={addFeature} size="sm">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {subscription.features.map((feature, index) => (
              <Badge key={index} variant="outline" className="flex items-center gap-1">
                {feature}
                <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => removeFeature(index)} />
              </Badge>
            ))}
          </div>
        </div>

        {/* Advanced Subscription Settings */}
        <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between bg-transparent">
              Advanced Subscription Settings
              {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="trial-days">Trial Days (Optional)</Label>
                <Input
                  id="trial-days"
                  type="number"
                  value={subscription.trial_days || ""}
                  onChange={(e) =>
                    setSubscription({
                      ...subscription,
                      trial_days: e.target.value ? Number.parseInt(e.target.value) : undefined,
                    })
                  }
                  placeholder="7"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="setup-fee">Setup Fee ($)</Label>
                <Input
                  id="setup-fee"
                  type="number"
                  step="0.01"
                  value={subscription.setup_fee || ""}
                  onChange={(e) =>
                    setSubscription({
                      ...subscription,
                      setup_fee: e.target.value ? Number.parseFloat(e.target.value) : undefined,
                    })
                  }
                  placeholder="9.99"
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    )
  },
)

export default function ProductsPage() {
  const { toast } = useToast()
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])
  const [products, setProducts] = useState<Product[]>([])
  const [analytics, setAnalytics] = useState<ProductAnalytics[]>([])
  const [loading, setLoading] = useState(true)
  const [userCompanyId, setUserCompanyId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("products")
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false)
  const [isEditProductDialogOpen, setIsEditProductDialogOpen] = useState(false)
  const [isDeleteProductDialogOpen, setIsDeleteProductDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [newProduct, setNewProduct] =
    useState<Omit<Product, "id" | "company_id" | "created_at" | "updated_at">>(emptyProduct)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [isCreatingCategory, setIsCreatingCategory] = useState(false)
  const [offers, setOffers] = useState<Offer[]>([])
  const [searchTermOffers, setSearchTermOffers] = useState("")
  const [isAddOfferDialogOpen, setIsAddOfferDialogOpen] = useState(false)
  const [isEditOfferDialogOpen, setIsEditOfferDialogOpen] = useState(false)
  const [isDeleteOfferDialogOpen, setIsDeleteOfferDialogOpen] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)
  const [newOffer, setNewOffer] = useState<Omit<Offer, "id" | "company_id" | "created_at" | "updated_at">>(emptyOffer)
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null)
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)
  const [newSubscription, setNewSubscription] =
    useState<Omit<Subscription, "id" | "company_id" | "created_at" | "updated_at">>(emptySubscription)
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null)
  const [isAddSubscriptionDialogOpen, setIsAddSubscriptionDialogOpen] = useState(false)
  const [isEditSubscriptionDialogOpen, setIsEditSubscriptionDialogOpen] = useState(false)
  const [isDeleteSubscriptionDialogOpen, setIsDeleteSubscriptionDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [importedItems, setImportedItems] = useState<ImportedItem[]>([])
  const [isProcessingImport, setIsProcessingImport] = useState(false)

  const supabase = createClient()

  const fetchSubscriptions = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase.from("user_profiles").select("company_id").eq("id", user.id).single()

      if (!profile?.company_id) return

      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("company_id", profile.company_id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching subscriptions:", error)
        toast({
          title: "Error",
          description: "Failed to load subscriptions",
          variant: "destructive",
        })
        return
      }

      setSubscriptions(data || [])
    } catch (error) {
      console.error("Error fetching subscriptions:", error)
    }
  }

  const fetchOffers = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase.from("user_profiles").select("company_id").eq("id", user.id).single()

      if (!profile?.company_id) return

      const { data, error } = await supabase
        .from("offers")
        .select("*")
        .eq("company_id", profile.company_id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching offers:", error)
        toast({
          title: "Error",
          description: "Failed to load offers",
          variant: "destructive",
        })
        return
      }

      setOffers(data || [])
    } catch (error) {
      console.error("Error fetching offers:", error)
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchCategories()
    fetchSubscriptions()
    fetchOffers()
  }, [])

  const fetchCategories = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.user) return

      const { data: staffData } = await supabase
        .from("staff")
        .select("company_id")
        .eq("user_id", session.user.id)
        .eq("status", "active")
        .single()

      if (!staffData) return

      const { data: categoriesData, error } = await supabase
        .from("categories")
        .select("id, name")
        .eq("company_id", staffData.company_id)
        .order("name")

      if (error) {
        console.error("Error fetching categories:", error)
        return
      }

      setCategories(categoriesData || [])
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)

      // Get current user
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to view products.",
          variant: "destructive",
        })
        return
      }

      // Get user's company from staff table
      const { data: staffData, error: staffError } = await supabase
        .from("staff")
        .select("company_id, permissions")
        .eq("user_id", session.user.id)
        .eq("status", "active")
        .single()

      if (staffError || !staffData) {
        toast({
          title: "Access denied",
          description: "You don't have access to products.",
          variant: "destructive",
        })
        return
      }

      setUserCompanyId(staffData.company_id)

      // Fetch products for the company
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*")
        .eq("company_id", staffData.company_id)
        .order("sort_order", { ascending: true })

      if (productsError) {
        toast({
          title: "Error fetching products",
          description: productsError.message,
          variant: "destructive",
        })
        return
      }

      setProducts(productsData || [])

      // Fetch analytics for the products
      const { data: analyticsData, error: analyticsError } = await supabase
        .from("products_daily_analysis")
        .select("*")
        .eq("company_id", staffData.company_id)
        .gte("analysis_date", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]) // Last 30 days

      if (!analyticsError && analyticsData) {
        setAnalytics(analyticsData)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load products data.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      toast({
        title: "Missing required fields",
        description: "Please fill in product name and price",
        variant: "destructive",
      })
      return
    }

    try {
      const { data, error } = await supabase
        .from("products")
        .insert([
          {
            ...newProduct,
            company_id: userCompanyId,
          },
        ])
        .select()
        .single()

      if (error) {
        toast({
          title: "Error adding product",
          description: error.message,
          variant: "destructive",
        })
        return
      }

      setProducts([...products, data])
      setNewProduct(emptyProduct)
      setIsAddProductDialogOpen(false)

      toast({
        title: "Product added",
        description: "Product has been successfully added.",
      })
    } catch (error) {
      console.error("Error adding product:", error)
      toast({
        title: "Error",
        description: "Failed to add product.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateProduct = async () => {
    if (!editingProduct) return

    try {
      const { data, error } = await supabase
        .from("products")
        .update({
          name: editingProduct.name,
          description: editingProduct.description,
          price: editingProduct.price,
          category: editingProduct.category,
          category_id: editingProduct.category_id,
          image_url: editingProduct.image_url,
          is_available: editingProduct.is_available,
          is_featured: editingProduct.is_featured,
          preparation_time: editingProduct.preparation_time,
          calories: editingProduct.calories,
          protein: editingProduct.protein,
          carbs: editingProduct.carbs,
          fat: editingProduct.fat,
          tags: editingProduct.tags,
          ingredients: editingProduct.ingredients,
          allergens: editingProduct.allergens,
          dietary_info: editingProduct.dietary_info,
          variants: editingProduct.variants,
          sort_order: editingProduct.sort_order,
        })
        .eq("id", editingProduct.id)
        .select()
        .single()

      if (error) {
        toast({
          title: "Error updating product",
          description: error.message,
          variant: "destructive",
        })
        return
      }

      setProducts(products.map((p) => (p.id === editingProduct.id ? data : p)))
      setEditingProduct(null)
      setIsEditProductDialogOpen(false)

      toast({
        title: "Product updated",
        description: "Product has been successfully updated.",
      })
    } catch (error) {
      console.error("Error updating product:", error)
      toast({
        title: "Error",
        description: "Failed to update product.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return

    try {
      const { error } = await supabase.from("products").delete().eq("id", selectedProduct.id)

      if (error) {
        toast({
          title: "Error deleting product",
          description: error.message,
          variant: "destructive",
        })
        return
      }

      setProducts(products.filter((p) => p.id !== selectedProduct.id))
      setSelectedProduct(null)
      setIsDeleteProductDialogOpen(false)

      toast({
        title: "Product deleted",
        description: "Product has been successfully deleted.",
      })
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive",
      })
    }
  }

  const getProductAnalytics = (productId: string) => {
    return analytics.filter((a) => a.product_id === productId)
  }

  const getTotalAnalytics = (productId: string) => {
    const productAnalytics = getProductAnalytics(productId)
    return productAnalytics.reduce(
      (total, day) => ({
        revenue: total.revenue + Number(day.daily_revenue),
        sales: total.sales + day.daily_sales_count,
        orders: total.orders + day.daily_orders_containing_product,
        favorites: total.favorites + day.daily_favorites,
      }),
      { revenue: 0, sales: 0, orders: 0, favorites: 0 },
    )
  }

  const categoryNames = categories.map((c) => c.name)

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const filteredOffers = offers.filter(
    (offer) =>
      offer.name.toLowerCase().includes(searchTermOffers.toLowerCase()) ||
      offer.description.toLowerCase().includes(searchTermOffers.toLowerCase()),
  )

  const filteredSubscriptions = subscriptions.filter(
    (subscription) =>
      subscription.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddSubscription = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase.from("user_profiles").select("company_id").eq("id", user.id).single()

      if (!profile?.company_id) return

      const { data, error } = await supabase
        .from("subscriptions")
        .insert([{ ...newSubscription, company_id: profile.company_id }])
        .select()
        .single()

      if (error) throw error

      setSubscriptions((prev) => [data, ...prev])
      setNewSubscription(emptySubscription)
      setIsAddSubscriptionDialogOpen(false)
      toast({
        title: "Success",
        description: "Subscription created successfully",
      })
    } catch (error) {
      console.error("Error creating subscription:", error)
      toast({
        title: "Error",
        description: "Failed to create subscription",
        variant: "destructive",
      })
    }
  }

  const handleEditSubscription = async () => {
    if (!editingSubscription) return

    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .update(editingSubscription)
        .eq("id", editingSubscription.id)
        .select()
        .single()

      if (error) throw error

      setSubscriptions((prev) => prev.map((sub) => (sub.id === data.id ? data : sub)))
      setEditingSubscription(null)
      setIsEditSubscriptionDialogOpen(false)
      toast({
        title: "Success",
        description: "Subscription updated successfully",
      })
    } catch (error) {
      console.error("Error updating subscription:", error)
      toast({
        title: "Error",
        description: "Failed to update subscription",
        variant: "destructive",
      })
    }
  }

  const handleDeleteSubscription = async () => {
    if (!selectedSubscription) return

    try {
      const { error } = await supabase.from("subscriptions").delete().eq("id", selectedSubscription.id)

      if (error) throw error

      setSubscriptions((prev) => prev.filter((sub) => sub.id !== selectedSubscription.id))
      setSelectedSubscription(null)
      setIsDeleteSubscriptionDialogOpen(false)
      toast({
        title: "Success",
        description: "Subscription deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting subscription:", error)
      toast({
        title: "Error",
        description: "Failed to delete subscription",
        variant: "destructive",
      })
    }
  }

  const handleAddOffer = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase.from("user_profiles").select("company_id").eq("id", user.id).single()

      if (!profile?.company_id) return

      const { data, error } = await supabase
        .from("offers")
        .insert([{ ...newOffer, company_id: profile.company_id }])
        .select()
        .single()

      if (error) throw error

      setOffers((prev) => [data, ...prev])
      setNewOffer(emptyOffer)
      setIsAddOfferDialogOpen(false)
      toast({
        title: "Success",
        description: "Offer created successfully",
      })
    } catch (error) {
      console.error("Error creating offer:", error)
      toast({
        title: "Error",
        description: "Failed to create offer",
        variant: "destructive",
      })
    }
  }

  const handleEditOffer = async () => {
    if (!editingOffer) return

    try {
      const { data, error } = await supabase
        .from("offers")
        .update(editingOffer)
        .eq("id", editingOffer.id)
        .select()
        .single()

      if (error) throw error

      setOffers((prev) => prev.map((offer) => (offer.id === data.id ? data : offer)))
      setEditingOffer(null)
      setIsEditOfferDialogOpen(false)
      toast({
        title: "Success",
        description: "Offer updated successfully",
      })
    } catch (error) {
      console.error("Error updating offer:", error)
      toast({
        title: "Error",
        description: "Failed to update offer",
        variant: "destructive",
      })
    }
  }

  const handleDeleteOffer = async () => {
    if (!selectedOffer) return

    try {
      const { error } = await supabase.from("offers").delete().eq("id", selectedOffer.id)

      if (error) throw error

      setOffers((prev) => prev.filter((offer) => offer.id !== selectedOffer.id))
      setSelectedOffer(null)
      setIsDeleteOfferDialogOpen(false)
      toast({
        title: "Success",
        description: "Offer deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting offer:", error)
      toast({
        title: "Error",
        description: "Failed to delete offer",
        variant: "destructive",
      })
    }
  }

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return

    setIsProcessingImport(true)
    setImportedItems([])

    // Simulate AI processing
    setTimeout(() => {
      const newItems: ImportedItem[] = []
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const baseId = Math.random().toString(36).substring(7)

        newItems.push({
          id: `${baseId}-1`,
          type: "product",
          name: `AI Extracted Product ${i + 1}`,
          description: "This product was automatically extracted from the document.",
          price: 19.99 + i,
          category: "Meal",
          confidence: 0.85,
          selected: true,
          rawData: { filename: file.name, size: file.size },
        })

        newItems.push({
          id: `${baseId}-2`,
          type: "subscription",
          name: `AI Extracted Subscription ${i + 1}`,
          description: "This subscription was automatically extracted from the document.",
          price: 49.99 + i,
          category: "Service",
          confidence: 0.92,
          selected: true,
          rawData: { filename: file.name, size: file.size },
        })

        newItems.push({
          id: `${baseId}-3`,
          type: "offer",
          name: `AI Extracted Offer ${i + 1}`,
          description: "This offer was automatically extracted from the document.",
          confidence: 0.78,
          selected: false,
          rawData: { filename: file.name, size: file.size },
        })
      }

      setImportedItems(newItems)
      setIsProcessingImport(false)
    }, 2000)
  }

  const handleBulkImport = async () => {
    const selectedItems = importedItems.filter((item) => item.selected)

    for (const item of selectedItems) {
      try {
        if (item.type === "product") {
          const { data, error } = await supabase
            .from("products")
            .insert([
              {
                company_id: userCompanyId,
                name: item.name,
                description: item.description,
                price: item.price,
                category: item.category,
              },
            ])
            .select()
            .single()

          if (error) {
            toast({
              title: "Error importing product",
              description: error.message,
              variant: "destructive",
            })
          } else {
            setProducts((prev) => [...prev, data])
          }
        } else if (item.type === "subscription") {
          const { data, error } = await supabase
            .from("subscriptions")
            .insert([
              {
                company_id: userCompanyId,
                name: item.name,
                description: item.description,
                price: item.price,
                category: item.category,
              },
            ])
            .select()
            .single()

          if (error) {
            toast({
              title: "Error importing subscription",
              description: error.message,
              variant: "destructive",
            })
          } else {
            setSubscriptions((prev) => [...prev, data])
          }
        } else if (item.type === "offer") {
          // Basic offer import, adjust as needed
          const { data, error } = await supabase
            .from("offers")
            .insert([
              {
                company_id: userCompanyId,
                name: item.name,
                description: item.description,
              },
            ])
            .select()
            .single()

          if (error) {
            toast({
              title: "Error importing offer",
              description: error.message,
              variant: "destructive",
            })
          } else {
            setOffers((prev) => [...prev, data])
          }
        }
      } catch (error) {
        console.error("Error during bulk import:", error)
        toast({
          title: "Error",
          description: `Failed to import ${item.type}: ${item.name}.`,
          variant: "destructive",
        })
      }
    }

    setIsImportDialogOpen(false)
    toast({
      title: "Import complete",
      description: `Successfully imported ${selectedItems.length} items.`,
    })
  }

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      })
      return
    }

    if (!userCompanyId) {
      toast({
        title: "Error",
        description: "Company information not found",
        variant: "destructive",
      })
      return
    }

    setIsCreatingCategory(true)
    try {
      const { data, error } = await supabase
        .from("categories")
        .insert({
          name: newCategoryName.trim(),
          company_id: userCompanyId,
        })
        .select()
        .single()

      if (error) throw error

      // Update categories list
      setCategories((prev) => [...prev, data])

      // Select the new category in the product form
      if (isAddProductDialogOpen) {
        setNewProduct((prev) => ({ ...prev, category_id: data.id }))
      } else if (isEditProductDialogOpen && editingProduct) {
        setEditingProduct((prev) => (prev ? { ...prev, category_id: data.id } : null))
      }

      // Reset form and close modal
      setNewCategoryName("")
      setIsAddCategoryDialogOpen(false)

      toast({
        title: "Success",
        description: "Category created successfully",
      })
    } catch (error) {
      console.error("Error creating category:", error)
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      })
    } finally {
      setIsCreatingCategory(false)
    }
  }

  if (loading) {
    return (
      <FloatingSidebar>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      </FloatingSidebar>
    )
  }

  const ProductCard = ({ product }: { product: Product }) => {
    const CategoryIcon = categoryIcons[product.category] || Utensils

    const analytics = getTotalAnalytics(product.id)

    return (
      <Card key={product.id} className="relative">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <CardDescription className="line-clamp-2">{product.description}</CardDescription>
            </div>
            <div className="flex items-center space-x-1">
              {product.is_featured && (
                <Badge variant="secondary">
                  <Star className="mr-1 h-3 w-3" />
                  Featured
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedProduct(product)
                  setIsDeleteProductDialogOpen(true)
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditingProduct(product)
                  setIsEditProductDialogOpen(true)
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">${product.price}</span>
              <Badge variant={product.is_available ? "default" : "secondary"}>
                {product.is_available ? "Available" : "Unavailable"}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div className="flex items-center">
                <DollarSign className="mr-1 h-3 w-3" />${analytics.revenue.toFixed(2)} revenue
              </div>
              <div className="flex items-center">
                <Package className="mr-1 h-3 w-3" />
                {analytics.sales} sales
              </div>
            </div>
            {product.category && <Badge variant="outline">{product.category}</Badge>}
          </div>
        </CardContent>
      </Card>
    )
  }

  const OfferCard = ({ offer }: { offer: Offer }) => {
    const config = offerTypeConfig[offer.type]

    return (
      <Card className="bg-upsell-card border-0 shadow-sm hover:shadow-md transition-all duration-200">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", config.color)}>
                <config.icon size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{offer.name}</h3>
                <Badge className={cn("text-xs", config.color)}>{config.label}</Badge>
              </div>
            </div>
            <Badge variant={offer.active ? "default" : "outline"} className="text-xs">
              {offer.active ? "Active" : "Inactive"}
            </Badge>
          </div>

          <p className="text-sm text-gray-600 mb-3">{offer.description}</p>

          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
            <div>
              <span className="font-medium">Start:</span> {new Date(offer.start_date).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">End:</span> {new Date(offer.end_date).toLocaleDateString()}
            </div>
            {offer.code && (
              <div className="col-span-2">
                <span className="font-medium">Code:</span> {offer.code}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingOffer(offer)
                setIsEditOfferDialogOpen(true)
              }}
            >
              <Edit size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
              onClick={() => {
                setSelectedOffer(offer)
                setIsDeleteOfferDialogOpen(true)
              }}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const SubscriptionCard = ({ subscription }: { subscription: Subscription }) => {
    const billingCycleLabels = {
      weekly: "Weekly",
      monthly: "Monthly",
      quarterly: "Quarterly",
      yearly: "Yearly",
    }

    return (
      <Card className="bg-upsell-card border-0 shadow-sm hover:shadow-md transition-all duration-200">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                <Ticket size={20} className="text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{subscription.name}</h3>
                <p className="text-sm text-gray-500">{subscription.category}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg">${subscription.price.toFixed(2)}</p>
              <Badge variant="outline" className="text-xs">
                {billingCycleLabels[subscription.billing_cycle]}
              </Badge>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{subscription.description}</p>

          <div className="space-y-2 mb-3">
            <div className="flex flex-wrap gap-1">
              {subscription.features.slice(0, 2).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {subscription.features.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{subscription.features.length - 2} more
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              <Badge variant={subscription.active ? "default" : "outline"} className="text-xs">
                {subscription.active ? "Active" : "Inactive"}
              </Badge>
              {subscription.popular && (
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Popular</Badge>
              )}
              {subscription.trial_days && <span>{subscription.trial_days} day trial</span>}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingSubscription(subscription)
                setIsEditSubscriptionDialogOpen(true)
              }}
            >
              <Edit size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
              onClick={() => {
                setSelectedSubscription(subscription)
                setIsDeleteSubscriptionDialogOpen(true)
              }}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <FloatingSidebar>
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products & Offers</h1>
            <p className="text-gray-600 mt-2">Manage your menu items and promotional offers</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="offers">Offers</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categoryNames.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <Dialog open={isAddProductDialogOpen} onOpenChange={setIsAddProductDialogOpen}>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>Create a new menu item</DialogDescription>
                </DialogHeader>
                <ProductForm
                  product={newProduct}
                  setProduct={setNewProduct}
                  categories={categories}
                  setIsAddCategoryDialogOpen={setIsAddCategoryDialogOpen}
                />
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddProductDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddProduct} className="bg-upsell-blue hover:bg-upsell-blue-hover">
                    <Save size={16} className="mr-2" />
                    Add Product
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isEditProductDialogOpen} onOpenChange={setIsEditProductDialogOpen}>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Product</DialogTitle>
                  <DialogDescription>Update product information</DialogDescription>
                </DialogHeader>
                {editingProduct && (
                  <ProductForm
                    product={editingProduct}
                    setProduct={setEditingProduct}
                    categories={categories}
                    setIsAddCategoryDialogOpen={setIsAddCategoryDialogOpen}
                  />
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditProductDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateProduct} className="bg-upsell-blue hover:bg-upsell-blue-hover">
                    <Save size={16} className="mr-2" />
                    Save Changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isDeleteProductDialogOpen} onOpenChange={setIsDeleteProductDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Product</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete {selectedProduct?.name}? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDeleteProductDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleDeleteProduct} className="bg-red-600 hover:bg-red-700 text-white">
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Category</DialogTitle>
                  <DialogDescription>Create a new category for your products</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoryName">Category Name</Label>
                    <Input
                      id="categoryName"
                      placeholder="Enter category name"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !isCreatingCategory) {
                          handleCreateCategory()
                        }
                      }}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddCategoryDialogOpen(false)
                      setNewCategoryName("")
                    }}
                    disabled={isCreatingCategory}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateCategory}
                    className="bg-upsell-blue hover:bg-upsell-blue-hover"
                    disabled={isCreatingCategory || !newCategoryName.trim()}
                  >
                    {isCreatingCategory ? "Creating..." : "Save Category"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="subscriptions" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder="Search subscriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSubscriptions.map((subscription) => (
                <SubscriptionCard key={subscription.id} subscription={subscription} />
              ))}
            </div>

            <Dialog open={isAddSubscriptionDialogOpen} onOpenChange={setIsAddSubscriptionDialogOpen}>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Subscription</DialogTitle>
                  <DialogDescription>Create a new subscription plan</DialogDescription>
                </DialogHeader>
                <SubscriptionForm
                  subscription={newSubscription}
                  setSubscription={setNewSubscription}
                  categories={categories}
                />
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddSubscriptionDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddSubscription} className="bg-upsell-blue hover:bg-upsell-blue-hover">
                    <Save size={16} className="mr-2" />
                    Add Subscription
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isEditSubscriptionDialogOpen} onOpenChange={setIsEditSubscriptionDialogOpen}>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Subscription</DialogTitle>
                  <DialogDescription>Update subscription information</DialogDescription>
                </DialogHeader>
                {editingSubscription && (
                  <SubscriptionForm
                    subscription={editingSubscription}
                    setSubscription={setEditingSubscription}
                    categories={categories}
                  />
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditSubscriptionDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleEditSubscription} className="bg-upsell-blue hover:bg-upsell-blue-hover">
                    <Save size={16} className="mr-2" />
                    Save Changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isDeleteSubscriptionDialogOpen} onOpenChange={setIsDeleteSubscriptionDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Subscription</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete {selectedSubscription?.name}? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDeleteSubscriptionDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleDeleteSubscription} className="bg-red-600 hover:bg-red-700 text-white">
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="offers" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder="Search offers..."
                  value={searchTermOffers}
                  onChange={(e) => setSearchTermOffers(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>

            <Dialog open={isAddOfferDialogOpen} onOpenChange={setIsAddOfferDialogOpen}>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Offer</DialogTitle>
                  <DialogDescription>Create a new promotional offer</DialogDescription>
                </DialogHeader>
                <OfferForm offer={newOffer} setOffer={setNewOffer} products={products} categories={categories} />
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddOfferDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddOffer} className="bg-upsell-blue hover:bg-upsell-blue-hover">
                    <Save size={16} className="mr-2" />
                    Add Offer
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isEditOfferDialogOpen} onOpenChange={setIsEditOfferDialogOpen}>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Offer</DialogTitle>
                  <DialogDescription>Update offer information</DialogDescription>
                </DialogHeader>
                {editingOffer && (
                  <OfferForm
                    offer={editingOffer}
                    setOffer={setEditingOffer}
                    products={products}
                    categories={categories}
                  />
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditOfferDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleEditOffer} className="bg-upsell-blue hover:bg-upsell-blue-hover">
                    <Save size={16} className="mr-2" />
                    Save Changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isDeleteOfferDialogOpen} onOpenChange={setIsDeleteOfferDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Offer</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete {selectedOffer?.name}? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDeleteOfferDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleDeleteOffer} className="bg-red-600 hover:bg-red-700 text-white">
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>

        {/* Floating Add Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => {
                if (activeTab === "products") setIsAddProductDialogOpen(true)
                else if (activeTab === "subscriptions") setIsAddSubscriptionDialogOpen(true)
                else if (activeTab === "offers") setIsAddOfferDialogOpen(true)
              }}
              className="rounded-full w-14 h-14 bg-upsell-blue hover:bg-upsell-blue-hover shadow-lg hover:shadow-xl transition-all duration-200"
              size="icon"
            >
              <Plus size={24} />
            </Button>
          </div>
        </div>

        {/* Import Dialog */}
        <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Import Products, Subscriptions & Offers</DialogTitle>
              <DialogDescription>Upload documents to automatically extract and import items using AI</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {filteredProducts.length === 0 && !isProcessingImport && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <div className="space-y-4">
                    <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <Plus size={24} className="text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Upload Documents</h3>
                      <p className="text-gray-500">Upload PDFs, images, or text files containing product information</p>
                    </div>
                    <div>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png,.txt,.doc,.docx"
                        onChange={(e) => handleFileUpload(e.target.files)}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-upsell-blue hover:bg-upsell-blue-hover cursor-pointer"
                      >
                        Choose Files
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {isProcessingImport && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-upsell-blue mx-auto mb-4"></div>
                  <h3 className="text-lg font-medium text-gray-900">Processing Documents</h3>
                  <p className="text-gray-500">AI is analyzing your documents and extracting information...</p>
                </div>
              )}

              {importedItems.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Extracted Items</h3>
                    <p className="text-sm text-gray-500">
                      {importedItems.filter((item) => item.selected).length} selected
                    </p>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {importedItems.map((item) => (
                      <div
                        key={item.id}
                        className={cn(
                          "border rounded-lg p-4 transition-colors",
                          item.selected ? "border-upsell-blue bg-blue-50" : "border-gray-200",
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={item.selected}
                            onChange={(e) =>
                              setImportedItems((prev) =>
                                prev.map((i) => (i.id === item.id ? { ...i, selected: e.target.checked } : i)),
                              )
                            }
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                {item.type}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs",
                                  item.confidence > 0.9
                                    ? "bg-green-100 text-green-800"
                                    : item.confidence > 0.7
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800",
                                )}
                              >
                                {Math.round(item.confidence * 100)}% confidence
                              </Badge>
                            </div>
                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                            <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              {item.price && <span>Price: ${item.price}</span>}
                              {item.category && <span>Category: {item.category}</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
                Cancel
              </Button>
              {importedItems.length > 0 && (
                <Button
                  onClick={handleBulkImport}
                  disabled={importedItems.filter((item) => item.selected).length === 0}
                  className="bg-upsell-blue hover:bg-upsell-blue-hover"
                >
                  Import {importedItems.filter((item) => item.selected).length} Items
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </FloatingSidebar>
  )
}
