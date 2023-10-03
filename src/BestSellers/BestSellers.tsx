import { LineSeparator } from "../LineSeparator";
import styles from './bestSellers.module.css'

const SLIDE_COUNT = 6;
const slides = Array.from(Array(SLIDE_COUNT).keys());

function BestSellers() {
    return ( <>
    <h1>Хиты продаж</h1>
    <LineSeparator/>
    <div className={styles.container}>
        {slides.map(i => (
           <div className={styles.listItem}>
             <div className={styles.imgContainer}>
                <img src="https://dev.fresq.ru/upload/iblock/01c/7f2731022dxqbmnw1du3kwlg7nfuxpyh.jpg" />
            </div>
            <div className={styles.name}>
                GEO.11
            </div>
           <div className={styles.price}> от 4350 р/м2</div>
           </div>
        ))}
    </div>
    </> );
}

export default BestSellers;