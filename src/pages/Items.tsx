import { useState } from 'react'

type Item = {
  name: string;
  type: string;
  price: number;
  image: string;
  discount?: number;
}

const itemsData: Item[] = [
  {
    name: 'Laptop',
    type: 'Electronics',
    price: 1200,
    image: '/images/laptop.jpg',
    discount: 20
  },
  {
    name: 'Headphones',
    type: 'Electronics',
    price: 150,
    image: '/images/headphones.jpg',
  },
  {
    name: 'Shoes',
    type: 'Clothing',
    price: 80,
    image: '/images/shoes.jpg',
    discount: 10
  },
  {
    name: 'T-Shirt',
    type: 'Clothing',
    price: 25,
    image: '/images/t-shirt.jpg',
  },
  {
    name: 'Coffee Maker',
    type: 'Home',
    price: 60,
    image: '/images/coffee-maker.jpg',
  },
  {
    name: 'Desk',
    type: 'Home',
    price: 200,
    image: '/images/desk.jpg',
  },
]

export default function Items() {
  const types = Array.from(new Set(itemsData.map((i) => i.type)))
  const minPrice = 0
  const maxPrice = Math.max(...itemsData.map((i) => i.price))

  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [discountOnly, setDiscountOnly] = useState(false)

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  const resetFilters = () => {
    setPriceRange([minPrice, maxPrice])
    setSelectedTypes([])
    setDiscountOnly(false)
  }

  const filteredItems = itemsData.filter((item) => {
    const finalPrice = item.discount ? (item.price * (1 - item.discount / 100)) : item.price
    const withinPrice = finalPrice >= priceRange[0] && finalPrice <= priceRange[1]
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(item.type)
    const matchesDiscount = !discountOnly || !!item.discount
    return withinPrice && matchesType && matchesDiscount
  })

  return (
    <div style={{ display: 'flex', padding: '1rem' }}>
      {/* Filters */}
      <div 
        className='container'
        style={{ 
          minWidth: '200px',
          marginRight: '1rem',
          padding: '1rem',
          minHeight: '80vh',
        }}
      >
        <h3 style={{ marginTop: '0px' }}>
          Filters
        </h3>

        {/* Discount Filter */}
        <div style={{ marginBottom: '1rem' }}>
          <label>
            <input
              style={{ marginLeft: '0px' }}
              name='only-discount'
              type="checkbox"
              checked={discountOnly}
              onChange={(e) => setDiscountOnly(e.target.checked)}
            />
            Only discount
          </label>
        </div>

        {/* Price Filter */}
        <div style={{ marginBottom: '1rem' }}>
          <span style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
            Price range:
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '40px' }}>Min:</span>
              <input
                name='min-price'
                type='number'
                value={priceRange[0]}
                min={minPrice}
                max={priceRange[1]}
                style={{ width: '100px', padding: '2px' }}
                onChange={(e) =>
                  setPriceRange([Number(e.target.value), priceRange[1]])
                }
              />
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '40px' }}>Max:</span>
              <input
                name='max-price'
                type='number'
                value={priceRange[1]}
                min={priceRange[0]}
                max={maxPrice}
                style={{ width: '100px', padding: '2px' }}
                onChange={(e) =>
                  setPriceRange([priceRange[0], Number(e.target.value)])
                }
              />
            </label>
          </div>
        </div>

        {/* Type Filter */}
        <div style={{ marginTop: '1rem' }} data-testid="type-filter">
          <span style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
            Type:
          </span>
          {types.map((type) => (
            <div key={type}>
              <input
                name={'include-'+type.toLowerCase()}
                type="checkbox"
                checked={selectedTypes.includes(type)}
                onChange={() => toggleType(type)}
              />
              {type}
            </div>
          ))}
        </div>

        {/* Reset Filters */}
        <div style={{ marginTop: '1rem' }}>
          <button
            onClick={resetFilters}
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Items List */}
      <div style={{ flex: 1 }}>
        <h3>
          Items
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '1rem',
          }}
        >
          {filteredItems.map((item, idx) => (
            <div 
              className='container item-card'
              data-testid="item-card"
              key={idx}
            >
              <div
                style={{
                  width: '100%',
                  maxWidth: '150px',
                  height: '150px',
                  margin: '0 auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  borderRadius: 'inherit',
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>
              {item.discount ? (
                <p>
                  <span 
                    data-testid="item-price"
                    style={{ fontWeight: 'bold', marginRight: '8px' }}
                  >
                    ${(item.price * (1 - item.discount / 100)).toFixed(2)}
                  </span>
                  <span 
                    data-testid="item-original-price"
                    style={{ textDecoration: 'line-through', color: 'gray' }}
                  >
                    ${item.price.toFixed(2)}
                  </span>
                </p>
              ) : (
                <p 
                  data-testid="item-price"
                  style={{ fontWeight: 'bold', }}
                >
                  ${item.price.toFixed(2)}
                </p>
              )}
              <p
                data-testid="item-type"
                style={{
                  color: 'gray',
                  fontSize: '0.85rem',
                  marginTop: '0px',
                  marginBottom: '0.30rem',
                }}
              >
                {item.type}
              </p>
              <h3 
                data-testid="item-name"
                style={{ marginTop: '0.30rem', marginBottom: '0px', }}
              >
                {item.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
