import { useState, useEffect } from "react";
import MainPanel from "./MainPanel";
import '../ContentRowTop.css'

function ContentRowTop() {

    const [products, setProducts] = useState();
    const [users, setUsers] = useState();
    const [productsTotal, setProductsTotal] = useState()


    useEffect(async ()=>{
        console.log('%cse montó el componente','color: green');
        const products  = await fetch('http://localhost:3000/products/api/productlist').then (response => response.json());
        const users     = await fetch('http://localhost:3000/users/api/userlist').then (response => response.json());
        // const productsTotal  = await fetch('http://localhost:3000/products/api/productlist').then (response => response.json());

        Promise.all([products, users])
        .then(function([resultadoProducts, resultadoUsers]){            
            setProducts(resultadoProducts.lastProductCreated[0]);
            setUsers(resultadoUsers.lastUserCreated[0]);
            setProductsTotal(resultadoProducts.categoriesCount)
            // 
        })
        .catch(error => console.error(error));
    }, []);

    useEffect(()=>{
        console.log('%cse ACTUALIZÓ el componente','color: blue');
        console.log('products-->' + products);
        console.log('users-->' + users);
        console.log('productsTotal-->' + productsTotal);
       

        if (products ==='undefined'){
            console.log('es distinto, la concha de la lora!!');
        }
     }, [products, users, productsTotal]);


    return(
        <div>
            <h1 className="totals">Totales</h1>
            { 
                products === 'undefined' && <p>Cargando</p>               
            }
             {
                // ultimo !== 'undefined' && 
                <ul>
                    {
                        
                    //   return (  
           
                    //             <li>
                    //                 <h4>{producto.id_product}</h4>
                    //                 <h4>{producto.description}</h4>
                    //                 <h4>{producto.creation_date}</h4>
                    //                 <h4>{producto.detailUrl}</h4>
                    //             </li>
                    //   )

                     products && users && 
                     <div className="totalContainer">
                        <div className="totalBox"> 
                                <h4>Total de productos: {products.id_product}</h4>
                       

                        </div> 

                        <br></br>    
                        <div className="totalBox"> 
                                <h4>Total de usuarios: {users.id_user}</h4>

                        </div>   
                        <br></br>  
                        <div className="totalBox"> 
                                <h4>Total de categorías: {productsTotal}</h4>

                        </div>   
                    </div>

                        

          
                        // products && users && products.map((producto, i) => {

                        //     return(
                        //         <li key={i}>
                        //             <h4>{producto.id_product}</h4>
                        //             <h4>{producto.description}</h4>
                        //             <h4>{producto.creation_date}</h4>
                        //             <h4>{producto.detailUrl}</h4>
                        //         </li>

                        //     )
                        // })                       
                        

                    }
                </ul>
            }
        </div>
    )
}

export default ContentRowTop