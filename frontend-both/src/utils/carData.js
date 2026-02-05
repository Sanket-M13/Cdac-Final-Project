// Car brands and models data
export const carData = {
  Tesla: [
    { model: 'Model 3', range: 500 },
    { model: 'Model S', range: 650 },
    { model: 'Model X', range: 580 },
    { model: 'Model Y', range: 520 }
  ],
  BMW: [
    { model: 'iX3', range: 460 },
    { model: 'i4', range: 590 },
    { model: 'iX', range: 630 }
  ],
  Audi: [
    { model: 'e-tron', range: 400 },
    { model: 'e-tron GT', range: 488 },
    { model: 'Q4 e-tron', range: 520 }
  ],
  'Mercedes-Benz': [
    { model: 'EQC', range: 417 },
    { model: 'EQS', range: 770 },
    { model: 'EQA', range: 426 }
  ],
  Tata: [
    { model: 'Nexon EV', range: 312 },
    { model: 'Tigor EV', range: 306 }
  ],
  MG: [
    { model: 'ZS EV', range: 419 },
    { model: 'Comet EV', range: 230 }
  ],
  Hyundai: [
    { model: 'Kona Electric', range: 452 },
    { model: 'Ioniq 5', range: 481 }
  ]
}

export const getCarBrands = () => Object.keys(carData)

export const getCarModels = (brand) => carData[brand] || []

export const getCarRange = (brand, model) => {
  const models = carData[brand] || []
  const car = models.find(m => m.model === model)
  return car ? car.range : 300
}