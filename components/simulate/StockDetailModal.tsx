'use client'

import { Stock } from '@/lib/mock-stocks'

interface StockDetailModalProps {
  stock: Stock
  onClose: () => void
}

export default function StockDetailModal({ stock, onClose }: StockDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-4xl font-bold tracking-tight text-white mb-2">{stock.ticker}</h2>
              <h3 className="text-2xl text-[#98989d] font-light">{stock.name}</h3>
            </div>
            <button
              onClick={onClose}
              className="text-[#98989d] hover:text-white transition-colors text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#2c2c2e]"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* Company Overview */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Company Overview</h4>
              <p className="text-[#98989d] font-light leading-relaxed">{stock.description}</p>
            </div>

            {/* Key Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="card-elevated p-4">
                <div className="text-xs text-[#98989d] font-light mb-1">Industry</div>
                <div className="text-sm font-semibold text-white">{stock.industry}</div>
              </div>
              <div className="card-elevated p-4">
                <div className="text-xs text-[#98989d] font-light mb-1">Sector</div>
                <div className="text-sm font-semibold text-white">{stock.sector}</div>
              </div>
              <div className="card-elevated p-4">
                <div className="text-xs text-[#98989d] font-light mb-1">Founded</div>
                <div className="text-sm font-semibold text-white">{stock.founded}</div>
              </div>
              <div className="card-elevated p-4">
                <div className="text-xs text-[#98989d] font-light mb-1">Headquarters</div>
                <div className="text-sm font-semibold text-white">{stock.headquarters}</div>
              </div>
              <div className="card-elevated p-4">
                <div className="text-xs text-[#98989d] font-light mb-1">Employees</div>
                <div className="text-sm font-semibold text-white">{stock.employees}</div>
              </div>
              <div className="card-elevated p-4">
                <div className="text-xs text-[#98989d] font-light mb-1">Current Price</div>
                <div className="text-sm font-semibold text-white">${stock.price.toFixed(2)}</div>
              </div>
            </div>

            {/* Key Products */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Key Products & Services</h4>
              <div className="flex flex-wrap gap-2">
                {stock.keyProducts.map((product, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-[#2c2c2e] rounded-lg text-sm text-white font-medium"
                  >
                    {product}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="button-primary py-3 px-8 text-base font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

