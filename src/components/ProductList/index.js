import './index.css'
import { BiSolidCategory } from "react-icons/bi";
function ProductList(props){
   const {eachProduct} = props
    const {title,price,category,description,dateOfSale,image,sold} = eachProduct
    const isAvailable = sold === '1'?'available':'not available'
    const textColor = isAvailable === 'available'?'available-style':'not-available'
   return( 
    <>
   <div className='products-container'>
            <h2>{title}</h2>
            <p><strong>Rs/-</strong> {price}</p>
            <div className='icon-container'>
                <BiSolidCategory className='icon'/>
                <p><strong>{category}</strong></p>
            </div>
            <p>{description}</p>
            <p className={textColor}><strong>{isAvailable}</strong></p>
            <p>{dateOfSale}</p>
            </div>
            <img className = "img-style" src = {image}/>
        </>
   )

}
export default ProductList