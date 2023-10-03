import classNames from "classnames";
import { useCartData } from "../hooks/useCartData";
import { LineSeparator } from "../LineSeparator";
import styles from './info.module.css';

function Info({isTextureImage}:{isTextureImage: boolean}) {

    const handleDownloadTextures = () => {
        const textures: string[] = [];
        document.querySelectorAll('.texture_image').forEach((img) => {
            if(img instanceof HTMLImageElement) {
                textures.push(img.src);
            }
        })
        saveImage(textures);
    }
    

    return ( <>
    <div className={styles.name_info_block}>Информация</div>
    <LineSeparator/>
    <div className={styles.container}>
        <div className={styles.left}>
            <div className={styles.info_block}>
                <div className={styles.title}>Размеры:</div>
                <div className={styles.description}>Стандартные панели - <br/> Бесшовное полотно - <br/> Кастомные размер по спецзаказу.</div>
            </div>
            <div className={styles.info_block}>
                <div className={styles.title}>Срок изготовления:</div>
                <div className={styles.description}>от 7 дней</div>
            </div>
            <div className={styles.info_block}>
                <div className={styles.title}>Состав:</div>
                <div className={styles.description}>Флизелин</div>
            </div>
            <div className={styles.info_block}>
                <div className={styles.title}>Уход:</div>
                <div className={styles.description}>Влажная уборка</div>
            </div>
            <div className={styles.info_block}>
                <div className={styles.title}>Монтаж:</div>
                <div className={styles.description}>Клей для флизелиновых обоев <br/><a href={`/info/wall/instruktsiya-po-pokleyke/`} target='_blank' rel='noopener noreferrer' className={styles.link}> Инструкция по монтажу &gt; </a></div>
            </div>
            <div className={styles.info_block}>
                <div className={styles.title}>Упаковка и доставка:</div>
                <div className={styles.description}><a href={`/info/wall/instruktsiya-po-pokleyke/`} target='_blank' rel='noopener noreferrer' className={styles.link}>Подробнее &gt; </a> </div>
            </div>
        </div>
        <div className={styles.center}>
        <div className={styles.info_block}>
                <div className={styles.titlex}>Возможности:</div>
                <div className={styles.description}>- сокращение сроков <br/> - любой цвет основы и рисунка <br/> - купить краску для соседних стен <br/> - сделать объемным рисунок <br/> - изменить композицию под ваш интерьер <br/> - добавление золота, серебра, перламутра, и т.д. в ваш рисунок <br/> - бесшовное или на рулонах изменение масштаба</div>
            </div>
            <div className={styles.info_block}>
                <div className={styles.title}>Как создаются обои:</div>
                <div className={styles.description}>Видео </div>
            </div>
        </div>
        <div className={styles.right}>
        <div className={styles.info_block}>
                <div className={styles.title}>Публикации:</div>
                <div className={styles.description}>...</div>
            </div>
            <div className={styles.info_block_ser}>
                <div className={styles.title}>Сертификаты качества:</div>
                <div className={styles.description}>...</div>
            </div>
            <div className={styles.info_block}>
                <div className={styles.title}>Для архитекторов и дизайнеров:</div>
                <div className={styles.description}>
                    {isTextureImage && (
    <button id={'textureDownloadApp'} className={classNames(styles.button, styles.buttonDonwloadTexture)} onClick={handleDownloadTextures}>
        {/* <svg width="20" height="20" viewBox="0 0 142 142" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M104.6 63.6H79.1V22.1C79.1 20.6 77.9 19.4 76.4 19.4H64.9C63.4 19.4 62.2 20.6 62.2 22.1V63.6H36.7C34.2 63.6 33 66.6 34.8 68.3L68.8 100.3C69.9 101.3 71.5 101.3 72.5 100.3L106.5 68.3C108.3 66.6 107.1 63.6 104.6 63.6Z" fill="black"/>
            <path d="M13.1 100.6V107C13.1 115.5 20 122.4 28.5 122.4H113.3C121.8 122.4 128.7 115.5 128.7 107V100.6" stroke="black" strokeWidth="8.5039" strokeMiterlimit="10" strokeLinecap="round"/>
        </svg> */}
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px"
	 viewBox="0 0 156.5 156.5" width={'20px'} height={'20px'}>
<path d="M118.8,65.7c-2.8-2.8-7.3-2.8-10,0L85.3,89.1V35.2c0-3.9-3.2-7.1-7.1-7.1s-7.1,3.2-7.1,7.1v53.9L47.7,65.7
	c-2.8-2.8-7.3-2.8-10,0c-2.8,2.8-2.8,7.3,0,10l34.4,34.4c1.7,1.7,3.9,2.5,6.2,2.5c2.2,0,4.5-0.8,6.2-2.5l34.4-34.4
	C121.6,72.9,121.6,68.4,118.8,65.7z"/>
<g>
	<g>
		<path d="M117.6,156.3H38.9c-21.3,0-38.7-17.4-38.7-38.7V38.9c0-21.3,17.4-38.7,38.7-38.7h78.7c21.3,0,38.7,17.4,38.7,38.7v78.7
			C156.3,138.9,138.9,156.3,117.6,156.3z M38.9,14.4c-13.5,0-24.5,11-24.5,24.5v78.7c0,13.5,11,24.5,24.5,24.5h78.7
			c13.5,0,24.5-11,24.5-24.5V38.9c0-13.5-11-24.5-24.5-24.5C117.6,14.4,38.9,14.4,38.9,14.4z"/>
	</g>
</g>
<g>
	<path d="M112.7,128.1H43.8c-3.9,0-7.1-3.2-7.1-7.1s3.2-7.1,7.1-7.1h68.8c3.9,0,7.1,3.2,7.1,7.1S116.6,128.1,112.7,128.1z"/>
</g>
</svg>
        <span>Скачать 3D текстуры</span>
    </button>
)}</div>
            </div>
        </div>
    </div>
    </> );
}
function saveImage(urls: string[]) {
    const link = document.createElement('a');

    link.setAttribute('download', 'texture.jpg');
    link.style.display = 'none';
    document.body.appendChild(link);

    urls.forEach((url) => {
        link.href = url;
        link.click();
    })

    document.body.removeChild(link);
}

export default Info;

