"use client"

import React from "react"
import { useState } from "react"
import { FloatingSidebar } from "@/components/floating-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Save,
  X,
  Tag,
  Percent,
  Truck,
  Ticket,
  Pizza,
  Coffee,
  Utensils,
  Dessert,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  demoProducts,
  demoOffers,
  demoProductSubscriptions,
  demoProductCategories,
  type Product,
  type Offer,
  type ProductSubscription,
} from "@/lib/demo-data"

// Add the import statement for the new utility function
import { handleNullValue } from "@/lib/null-value-handler"

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
  name: string
  description: string
  price: number
  billingCycle: string
  features: string[]
  popular: boolean
  active: boolean
  category: string
  trialDays?: number
  setupFee?: number
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

const emptyProduct: Omit<
  Product,
  | "id"
  | "company_id"
  | "total_orders"
  | "total_revenue"
  | "sort_order"
  | "monthly_data"
  | "ai_recommendation_score"
  | "ai_upsell_items"
  | "customization_options"
  | "allergens"
  | "low_stock_threshold"
  | "stock_quantity"
  | "track_inventory"
  | "image_url"
  | "cost"
> = {
  name: "",
  description: "",
  price: 0,
  category_id: "",
  is_available: true,
  is_featured: false,
  dietary_tags: [],
  tags: [],
  ingredients: [],
  nutritionalInfo: {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  },
}

const emptyOffer: Omit<Offer, "id"> = {
  name: "",
  description: "",
  type: "discount",
  value: "",
  startDate: new Date().toISOString().split("T")[0],
  endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split("T")[0],
  active: true,
  appliesTo: "all",
  minOrderValue: 0,
  buyProducts: [],
  getProducts: [],
  buyQuantity: 1,
  getQuantity: 1,
}

const emptySubscription: Omit<Subscription, "id"> = {
  name: "",
  description: "",
  price: 0,
  billingCycle: "monthly",
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
  }: {
    product: Product | Omit<Product, "id">
    setProduct: (p: any) => void
    categories: string[]
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
              onValueChange={(value) => setProduct({ ...product, category_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {demoProductCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
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
                    value={product.nutritionalInfo?.calories || 0}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        nutritionalInfo: {
                          ...(product.nutritionalInfo || { protein: 0, carbs: 0, fat: 0 }),
                          calories: Number.parseInt(e.target.value) || 0,
                        },
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
                    value={product.nutritionalInfo?.protein || 0}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        nutritionalInfo: {
                          ...(product.nutritionalInfo || { calories: 0, carbs: 0, fat: 0 }),
                          protein: Number.parseInt(e.target.value) || 0,
                        },
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
                    value={product.nutritionalInfo?.carbs || 0}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        nutritionalInfo: {
                          ...(product.nutritionalInfo || { calories: 0, protein: 0, fat: 0 }),
                          carbs: Number.parseInt(e.target.value) || 0,
                        },
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
                    value={product.nutritionalInfo?.fat || 0}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        nutritionalInfo: {
                          ...(product.nutritionalInfo || { calories: 0, protein: 0, carbs: 0 }),
                          fat: Number.parseInt(e.target.value) || 0,
                        },
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
        const existingProduct = prevOffer.buyProducts?.find((item: any) => item.productId === productId)
        if (existingProduct) {
          return {
            ...prevOffer,
            buyProducts: prevOffer.buyProducts?.map((item: any) =>
              item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
            ),
          }
        } else {
          return {
            ...prevOffer,
            buyProducts: [...(prevOffer.buyProducts || []), { productId, quantity: 1 }],
          }
        }
      })
    }

    const addGetProduct = (productId: string) => {
      setOffer((prevOffer: any) => {
        const existingProduct = prevOffer.getProducts?.find((item: any) => item.productId === productId)
        if (existingProduct) {
          return {
            ...prevOffer,
            getProducts: prevOffer.getProducts?.map((item: any) =>
              item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
            ),
          }
        } else {
          return {
            ...prevOffer,
            getProducts: [...(prevOffer.getProducts || []), { productId, quantity: 1 }],
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
              value={offer.startDate}
              onChange={(e) => setOffer({ ...offer, startDate: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={offer.endDate}
              onChange={(e) => setOffer({ ...offer, endDate: e.target.value })}
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
              <Select value={offer.appliesTo} onValueChange={(value: any) => setOffer({ ...offer, appliesTo: value })}>
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

            {offer.appliesTo === "category" && (
              <div className="space-y-2">
                <Label htmlFor="appliesToValue">Category</Label>
                <Select
                  value={offer.appliesToValue || ""}
                  onValueChange={(value) => setOffer({ ...offer, appliesToValue: value })}
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

            {offer.appliesTo === "specific" && (
              <div className="space-y-2">
                <Label htmlFor="appliesToValue">Product</Label>
                <Select
                  value={offer.appliesToValue || ""}
                  onValueChange={(value) => setOffer({ ...offer, appliesToValue: value })}
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
                value={offer.minOrderValue || 0}
                onChange={(e) => setOffer({ ...offer, minOrderValue: Number.parseFloat(e.target.value) || 0 })}
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
                        {offer.buyProducts && offer.buyProducts.length > 0 && (
                          <div className="space-y-2">
                            <Label className="text-sm">Selected Buy Products:</Label>
                            {offer.buyProducts.map((item, index) => {
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
                                        buyProducts: offer.buyProducts?.filter((_, i) => i !== index),
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
                    {offer.getProducts && offer.getProducts.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm">Selected Get Products:</Label>
                        {offer.getProducts.map((item, index) => {
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
                                    getProducts: offer.getProducts?.filter((_, i) => i !== index),
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
    categories: string[]
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
              value={subscription.billingCycle}
              onValueChange={(value: any) => setSubscription({ ...subscription, billingCycle: value })}
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
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
                <SelectItem value="Beverage">Beverage</SelectItem>
                <SelectItem value="Meal Kit">Meal Kit</SelectItem>
                <SelectItem value="Experience">Experience</SelectItem>
                <SelectItem value="Service">Service</SelectItem>
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
                  value={subscription.trialDays || ""}
                  onChange={(e) =>
                    setSubscription({
                      ...subscription,
                      trialDays: e.target.value ? Number.parseInt(e.target.value) : undefined,
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
                  value={subscription.setupFee || ""}
                  onChange={(e) =>
                    setSubscription({
                      ...subscription,
                      setupFee: e.target.value ? Number.parseFloat(e.target.value) : undefined,
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
  const [activeTab, setActiveTab] = useState("products")
  const [products, setProducts] = useState<Product[]>(demoProducts)
  const [offers, setOffers] = useState<Offer[]>(demoOffers)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false)
  const [isEditProductDialogOpen, setIsEditProductDialogOpen] = useState(false)
  const [isDeleteProductDialogOpen, setIsDeleteProductDialogOpen] = useState(false)
  const [isAddOfferDialogOpen, setIsAddOfferDialogOpen] = useState(false)
  const [isEditOfferDialogOpen, setIsEditOfferDialogOpen] = useState(false)
  const [isDeleteOfferDialogOpen, setIsDeleteOfferDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)
  const [newProduct, setNewProduct] =
    useState<
      Omit<
        Product,
        | "id"
        | "company_id"
        | "category_id"
        | "total_orders"
        | "total_revenue"
        | "sort_order"
        | "ai_upsell_items"
        | "ai_recommendation_score"
      >
    >(emptyProduct)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [newOffer, setNewOffer] = useState<Omit<Offer, "id">>(emptyOffer)
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null)
  const [subscriptions, setSubscriptions] = useState<ProductSubscription[]>(demoProductSubscriptions)
  const [selectedSubscription, setSelectedSubscription] = useState<ProductSubscription | null>(null)
  const [newSubscription, setNewSubscription] = useState<Omit<ProductSubscription, "id">>(emptySubscription)
  const [editingSubscription, setEditingSubscription] = useState<ProductSubscription | null>(null)
  const [isAddSubscriptionDialogOpen, setIsAddSubscriptionDialogOpen] = useState(false)
  const [isEditSubscriptionDialogOpen, setIsEditSubscriptionDialogOpen] = useState(false)
  const [isDeleteSubscriptionDialogOpen, setIsDeleteSubscriptionDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [importedItems, setImportedItems] = useState<ImportedItem[]>([])
  const [isProcessingImport, setIsProcessingImport] = useState(false)

  const categoryMap = React.useMemo(() => {
    return demoProductCategories.reduce(
      (map, category) => {
        map[category.id] = category.name
        return map
      },
      {} as Record<string, string>,
    )
  }, [])

  const categories = Array.from(
    new Set([...products.map((p) => p.category_id), ...subscriptions.map((s) => s.category)]),
  )

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || product.category_id === categoryFilter
    return matchesSearch && matchesCategory
  })

  const filteredOffers = offers.filter(
    (offer) =>
      offer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredSubscriptions = subscriptions.filter(
    (subscription) =>
      subscription.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddProduct = () => {
    const product: Product = {
      ...newProduct,
      id: `prod_${Date.now()}`,
      company_id: "comp_1",
      total_orders: 0,
      total_revenue: 0,
      sort_order: 0,
      monthly_data: { revenue: [], orders: [] },
      ai_recommendation_score: 0,
      ai_upsell_items: [],
      customization_options: {},
      allergens: [],
      low_stock_threshold: 0,
      stock_quantity: 0,
      track_inventory: false,
      image_url: "",
      cost: 0,
    }
    setProducts([...products, product])
    setNewProduct(emptyProduct)
    setIsAddProductDialogOpen(false)
  }

  const handleEditProduct = () => {
    if (editingProduct) {
      setProducts(products.map((p) => (p.id === editingProduct.id ? editingProduct : p)))
      setEditingProduct(null)
      setIsEditProductDialogOpen(false)
    }
  }

  const handleDeleteProduct = () => {
    if (selectedProduct) {
      setProducts(products.filter((p) => p.id !== selectedProduct.id))
      setSelectedProduct(null)
      setIsDeleteProductDialogOpen(false)
    }
  }

  const handleAddOffer = () => {
    const id = (Math.max(...offers.map((o) => Number.parseInt(o.id))) + 1).toString()
    const offer: Offer = { ...newOffer, id }
    setOffers([...offers, offer])
    setNewOffer(emptyOffer)
    setIsAddOfferDialogOpen(false)
  }

  const handleEditOffer = () => {
    if (editingOffer) {
      setOffers(offers.map((o) => (o.id === editingOffer.id ? editingOffer : o)))
      setEditingOffer(null)
      setIsEditOfferDialogOpen(false)
    }
  }

  const handleDeleteOffer = () => {
    if (selectedOffer) {
      setOffers(offers.filter((o) => o.id !== selectedOffer.id))
      setSelectedOffer(null)
      setIsDeleteOfferDialogOpen(false)
    }
  }

  const handleAddSubscription = () => {
    const id = (Math.max(...subscriptions.map((s) => Number.parseInt(s.id))) + 1).toString()
    const subscription: Subscription = { ...newSubscription, id }
    setSubscriptions([...subscriptions, subscription])
    setNewSubscription(emptySubscription)
    setIsAddSubscriptionDialogOpen(false)
  }

  const handleEditSubscription = () => {
    if (editingSubscription) {
      setSubscriptions(subscriptions.map((s) => (s.id === editingSubscription.id ? editingSubscription : s)))
      setEditingSubscription(null)
      setIsEditSubscriptionDialogOpen(false)
    }
  }

  const handleDeleteSubscription = () => {
    if (selectedSubscription) {
      setSubscriptions(subscriptions.filter((s) => s.id !== selectedSubscription.id))
      setSelectedSubscription(null)
      setIsDeleteSubscriptionDialogOpen(false)
    }
  }

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setIsProcessingImport(true)

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock intelligent parsing results
    const mockImportedItems: ImportedItem[] = [
      {
        id: "import-1",
        type: "product",
        name: "Artisan Sourdough Bread",
        description: "Handcrafted sourdough bread with organic flour",
        price: 8.99,
        category: "Bakery",
        confidence: 0.95,
        selected: true,
        rawData: { source: files[0].name },
      },
      {
        id: "import-2",
        type: "subscription",
        name: "Daily Fresh Bread",
        description: "Fresh bread delivered daily to your door",
        price: 24.99,
        category: "Bakery",
        confidence: 0.88,
        selected: true,
        rawData: { source: files[0].name },
      },
      {
        id: "import-3",
        type: "offer",
        name: "Buy 2 Get 1 Free Bread",
        description: "Special offer on all bread items",
        confidence: 0.92,
        selected: true,
        rawData: { source: files[0].name },
      },
    ]

    setImportedItems(mockImportedItems)
    setIsProcessingImport(false)
  }

  const handleBulkImport = () => {
    const selectedItems = importedItems.filter((item) => item.selected)

    selectedItems.forEach((item) => {
      if (item.type === "product") {
        const newProduct: Product = {
          id: `prod_${Date.now()}`,
          company_id: "comp_1",
          name: item.name,
          description: item.description || "",
          price: item.price || 0,
          category_id: "cat_1", // Default category
          is_available: true,
          is_featured: false,
          tags: ["Imported"],
          ingredients: [],
          nutritionalInfo: { calories: 0, protein: 0, carbs: 0, fat: 0 },
          total_orders: 0,
          total_revenue: 0,
          sort_order: 0,
          monthly_data: { revenue: [], orders: [] },
        }
        setProducts((prev) => [...prev, newProduct])
      } else if (item.type === "subscription") {
        const newSub: Subscription = {
          id: (Math.max(...subscriptions.map((s) => Number.parseInt(s.id))) + 1).toString(),
          name: item.name,
          description: item.description,
          price: item.price || 0,
          billingCycle: "monthly",
          features: ["Imported feature"],
          popular: false,
          active: true,
          category: item.category || "Imported",
        }
        setSubscriptions((prev) => [...prev, newSub])
      }
    })

    setImportedItems([])
    setIsImportDialogOpen(false)
  }

  const ProductCard = ({ product }: { product: Product }) => {
    const CategoryIcon = categoryIcons[product.category_id] || Utensils

    return (
      <Card className="bg-upsell-card border-0 shadow-sm hover:shadow-md transition-all duration-200">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <CategoryIcon size={20} className="text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-500">{categoryMap[product.category_id] || product.category_id}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg">${product.price.toFixed(2)}</p>
              <Badge variant={product.is_available ? "default" : "outline"} className="text-xs">
                {product.is_available ? "Available" : "Unavailable"}
              </Badge>
            </div>
          </div>

          {/* Update the ProductCard component to use the handleNullValue function for description: */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {handleNullValue(product.description, "No description provided")}
          </p>

          <div className="flex flex-wrap gap-1 mb-3">
            {product.dietary_tags?.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {product.dietary_tags && product.dietary_tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{product.dietary_tags.length - 2}
              </Badge>
            )}
          </div>

          {product.is_featured && (
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 mb-3">Popular</Badge>
          )}

          <div className="flex justify-end gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingProduct(product)
                setIsEditProductDialogOpen(true)
              }}
            >
              <Edit size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
              onClick={() => {
                setSelectedProduct(product)
                setIsDeleteProductDialogOpen(true)
              }}
            >
              <Trash2 size={16} />
            </Button>
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
              <span className="font-medium">Start:</span> {new Date(offer.startDate).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">End:</span> {new Date(offer.endDate).toLocaleDateString()}
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
                {billingCycleLabels[subscription.billingCycle]}
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
              {subscription.trialDays && <span>{subscription.trialDays} day trial</span>}
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
                  {categories.map((category) => (
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
                <ProductForm product={newProduct} setProduct={setNewProduct} categories={categories} />
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
                  <ProductForm product={editingProduct} setProduct={setEditingProduct} categories={categories} />
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditProductDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleEditProduct} className="bg-upsell-blue hover:bg-upsell-blue-hover">
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
              {importedItems.length === 0 && !isProcessingImport && (
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
