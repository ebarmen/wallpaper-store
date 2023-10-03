import React, { useContext } from "react";
import styles from "./canvasbuttonslist.module.css";
import { DownloadIcon, MirrorIcon, WebIcon } from "../../../Icons";
import JsPDF from "jspdf";
import { canvasHandFrameDataContext } from "../../../context/canvasHandFrameDataContext";
import { canvasTextureContext } from "../../../context/canvasTextureContext";
import { canvasBackgroundContext } from "../../../context/canvasBackgroundContext";
import { canvasModeContext } from "../../../context/canvasModeContext";
import { canvasTotalPriceContext } from "../../../context/canvasTotalPriceContext";
import html2canvas from "html2canvas";
import autoTable from "jspdf-autotable";
import { PTSans } from "../../../fonts/PTSans";
import { canvasOptionsContext } from "../../../context/canvasOptionsContext";
import { OptionNames } from "../../../types/namesList";
import { display } from "html2canvas/dist/types/css/property-descriptors/display";
import { log } from "util";

interface ICanvasButtonsList {
  gridCnt: number;
  dragX: number;
}

export function CanvasButtonsList(props: ICanvasButtonsList) {
  const { gridCnt, dragX } = props;

  const { imgData } = useContext(canvasTextureContext);
  const { backgroundData } = useContext(canvasBackgroundContext);
  const { handFrameData } = useContext(canvasHandFrameDataContext);
  const { options } = useContext(canvasOptionsContext);
  const { mode, isSeamless, isSigned } = useContext(canvasModeContext);
  const { price } = useContext(canvasTotalPriceContext);

  const makeWebLink = () => {
    const selectedOptions =
      document.getElementsByClassName("js-selected-option");
    const hiddenOptions = document.getElementsByClassName("js-hidden-option");

    const arOptions: string[] = [];
    [].forEach.call(selectedOptions, function (el: HTMLElement) {
      arOptions.push(el.innerHTML);
    });

    const arHidden: string[] = [];
    [].forEach.call(hiddenOptions, function (el: HTMLElement) {
      arHidden.push(el.innerHTML);
    });

    let isExtraPrice = false;
    options?.items.forEach((item) => {
      if (item.name === OptionNames.Example && item.isExtraPrice)
        isExtraPrice = true;
    });

    const name = document.getElementById("element_name")?.innerHTML,
      category = document.getElementById("element_category")?.innerHTML,
      img = imgData.img,
      background = backgroundData.img,
      backgroundName = backgroundData.name,
      imgPrice = imgData.price,
      backgroundPrice = backgroundData.price,
      groupName = backgroundData.groupName,
      seamless = arOptions.indexOf(OptionNames.Seamless) > -1,
      standartSizes = arOptions.indexOf(OptionNames.StandartSizes) > -1,
      signature = arOptions.indexOf(OptionNames.Signature) > -1,
      varnish = arOptions.indexOf(OptionNames.Varnish) > -1,
      install = arOptions.indexOf(OptionNames.Install) > -1,
      example = arOptions.indexOf(OptionNames.Example) > -1,
      examples = arOptions.indexOf(OptionNames.Examples) > -1,
      hidden = arHidden.join(","),
      extraPrice = isExtraPrice,
      params =
        "name=" +
        name +
        "&category=" +
        category +
        "&img=" +
        img +
        "&background=" +
        background +
        "&backgroundName=" +
        backgroundName +
        "&imgPrice=" +
        imgPrice +
        "&backgroundPrice=" +
        backgroundPrice +
        "&groupName=" +
        groupName +
        "&mode=" +
        mode +
        "&isSeamless=" +
        isSeamless +
        "&isSigned=" +
        isSigned +
        "&gridCnt=" +
        gridCnt +
        "&dragX=" +
        dragX +
        "&handFrame=" +
        JSON.stringify(handFrameData) +
        "&seamless=" +
        seamless +
        "&standartSizes=" +
        standartSizes +
        "&signature=" +
        signature +
        "&varnish=" +
        varnish +
        "&install=" +
        install +
        "&example=" +
        example +
        "&examples=" +
        examples +
        "&extra=" +
        extraPrice +
        "&hidden=" +
        hidden;

    const weblink =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname +
      "?" +
      params;

    return weblink;
  };

  const handleMakeWebLink = () => {
    const weblink = makeWebLink();

    navigator.clipboard.writeText(weblink).then(
      function () {
        alert(`Ваша ссылка ${weblink} скопирована в буфер обмена`);
      },
      function (err) {
        alert(`Ошибка, ссылка ${weblink} НЕ скопирована в буфер обмена`);
      },
    );
  };

  const handleMakeWebLinkToDataAttr = () => {
    const weblink = makeWebLink(),
      element = document.getElementById("element");
    if (element) element.setAttribute("data-weblink", weblink);
  };

  const handleDownloadPDF = () => {
    if (options) {
      console.log(options.items);
      const input = document.getElementsByClassName("js-canvas-pdf")[0],
        weblink = makeWebLink(),
        dateObj = new Date(),
        dd = String(dateObj.getDate()).padStart(2, "0"),
        mm = String(dateObj.getMonth() + 1).padStart(2, "0"), //January is 0!
        yyyy = dateObj.getFullYear(),
        curDate =
          dd +
          "." +
          mm +
          "." +
          yyyy +
          " " +
          dateObj.getHours() +
          ":" +
          dateObj.getMinutes(),
        warningText =
          "*ВНИМАНИЕ! Без подписи заказ в производство не запускается!\n" +
          "Внимательно проверьте размеры и комплектацию. Данный чертеж является документом, по которому будет выполняться заказ." +
          "Перед самостоятельной поклейкой обязательно ознакомьтесь с инструкцией на сайте." +
          "Приведенная иллюстрация не воспроизводит точный цвет. Цвет утверждается только на образце. После уточнения технического задания цена может измениться. Заказчик осведомлен, что чертеж и финальная работа могут" +
          "различаться по композиционным," +
          "цветовым и прочим характеристикам(кроме указанных размеров стены). Это обусловлено характером ручной работы и в этом заключается эксклюзивность каждого изделия. Это не является деффектом и не может служить" +
          "основанием к претензиям." +
          "Заказчик осведомлен, что видимые швы на стыках полотен не являются деффектом продукции или неудовлетворительной работой при поклейке полотен." +
          "Стоимость монтажа рассчитана из стандартных условий, возможна наценка за фигурные подрезы сложных элементов, поклейку обоев в рамки, поклейку обоев на потолок и других условий. Изображние для использования в" +
          "архитектурных проектах. Нелицензионное копирование изображений преследуется законом.",
        infoData =
          `Название: ${imgData.items[0].name}\n` +
          `Фон: ${backgroundData.name}\n` +
          `Размеры: ${Math.round(handFrameData.width)} см на ${Math.round(
            handFrameData.height,
          )} см\n` +
          `Площадь: ${
            Math.round((handFrameData.width * handFrameData.height) / 100) / 100
          } м2\n` +
          `Цена: ${price} р.`,
        optionsData = options.items[6].isHidden
          ? "ОПЦИИ:\n" +
            `${OptionNames.Seamless}: ${
              options.items[0].isHidden
                ? "-"
                : options.items[0].isSet
                ? "да"
                : "нет"
            }\n` +
            `${OptionNames.StandartSizes}: ${
              options.items[1].isHidden
                ? "-"
                : options.items[1].isSet
                ? "да"
                : "нет"
            }\n` +
            `${OptionNames.Signature}: ${
              options.items[2].isHidden
                ? "-"
                : options.items[2].isSet
                ? "да"
                : "нет"
            }\n` +
            `${OptionNames.Varnish}: ${
              options.items[3].isHidden
                ? "-"
                : options.items[3].isSet
                ? "да"
                : "нет"
            }\n` +
            `${OptionNames.Install}: ${
              options.items[4].isHidden
                ? "-"
                : options.items[4].isSet
                ? "да"
                : "нет"
            }\n` +
            `${OptionNames.Example}: ${
              options.items[5].isHidden
                ? "-"
                : options.items[5].isSet
                ? "да"
                : "нет"
            }`
          : "ОПЦИИ:\n" +
            `${OptionNames.Seamless}: ${
              options.items[0].isHidden
                ? "-"
                : options.items[0].isSet
                ? "да"
                : "нет"
            }\n` +
            `${OptionNames.StandartSizes}: ${
              options.items[1].isHidden
                ? "-"
                : options.items[1].isSet
                ? "да"
                : "нет"
            }\n` +
            `${OptionNames.Signature}: ${
              options.items[2].isHidden
                ? "-"
                : options.items[2].isSet
                ? "да"
                : "нет"
            }\n` +
            `${OptionNames.Varnish}: ${
              options.items[3].isHidden
                ? "-"
                : options.items[3].isSet
                ? "да"
                : "нет"
            }\n` +
            `${OptionNames.Install}: ${
              options.items[4].isHidden
                ? "-"
                : options.items[4].isSet
                ? "да"
                : "нет"
            }\n` +
            `${OptionNames.Examples}: ${
              options.items[6].isHidden
                ? "-"
                : options.items[6].isSet
                ? "да"
                : "нет"
            }`;
      html2canvas(input as HTMLElement).then((canvas) => {
        const imgDataBase64 = canvas.toDataURL("image/png"),
          unit = "px",
          size = "A4",
          orientation = "landscape",
          marginLeft = 40,
          pdf = new JsPDF(orientation, unit, size),
          logoImage =
            "data:image/jpg;base64,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";
        pdf.addFileToVFS("PTSans-normal.ttf", PTSans);
        pdf.addFont("PTSans-normal.ttf", "PTSans", "normal");
        pdf.setFont("PTSans");
        pdf.setFontSize(10);
        pdf.addImage(logoImage, "jpg", marginLeft, 10, 120, 9);
        pdf.text(curDate, marginLeft + 500, 10);

        const imageHeight = (540 * canvas.height) / canvas.width;

        pdf.addImage(imgDataBase64, "JPEG", marginLeft, 30, 540, imageHeight);

        autoTable(pdf, {
          theme: "grid",
          styles: {
            lineColor: "#333333",
            font: "PTSans",
          },
          startY: 290,
          body: [
            [
              {
                content:
                  "Чертеж утвержден\n" +
                  "Подпись заказчика*\n" +
                  "\n" +
                  "\n" +
                  "\n" +
                  "\n" +
                  "---------------",
                rowSpan: 2,
                colSpan: 1,
                styles: { valign: "middle", halign: "center", cellWidth: 80 },
              },
              {
                content: infoData,
                colSpan: 1,
                styles: { fontSize: 8, minCellWidth: 150 },
              },
              {
                content: optionsData,
                colSpan: 1,
                styles: { fontSize: 8, minCellWidth: 150 },
              },
              {
                content: "Веб ссылка:\n" + weblink,
                colSpan: 1,
                styles: { fontSize: 7 },
              },
            ],
            [
              {
                content: warningText,
                colSpan: 3,
                styles: { fontSize: 7 },
              },
            ],
          ],
        });

        pdf.save(imgData.items[0].name + ".pdf");
      });
    }
  };

  return (
    <div className={`${styles.container} row`}>
      <div className={styles.button} onClick={() => handleMakeWebLink()}>
        <WebIcon className={styles.webIcon} />
        <span>Веб ссылка</span>
      </div>
      <div
        id={"js-hidden-make-weblink"}
        style={{ display: "none" }}
        onClick={() => handleMakeWebLinkToDataAttr()}
      ></div>
      <div className={styles.button} onClick={() => handleDownloadPDF()}>
        {/* <DownloadIcon className={styles.downloadIcon}/> */}
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          viewBox="0 0 156.5 156.5"
          width={"20px"}
          height={"20px"}
        >
          <path
            d="M118.8,65.7c-2.8-2.8-7.3-2.8-10,0L85.3,89.1V35.2c0-3.9-3.2-7.1-7.1-7.1s-7.1,3.2-7.1,7.1v53.9L47.7,65.7
	c-2.8-2.8-7.3-2.8-10,0c-2.8,2.8-2.8,7.3,0,10l34.4,34.4c1.7,1.7,3.9,2.5,6.2,2.5c2.2,0,4.5-0.8,6.2-2.5l34.4-34.4
	C121.6,72.9,121.6,68.4,118.8,65.7z"
          />
          <g>
            <g>
              <path
                d="M117.6,156.3H38.9c-21.3,0-38.7-17.4-38.7-38.7V38.9c0-21.3,17.4-38.7,38.7-38.7h78.7c21.3,0,38.7,17.4,38.7,38.7v78.7
			C156.3,138.9,138.9,156.3,117.6,156.3z M38.9,14.4c-13.5,0-24.5,11-24.5,24.5v78.7c0,13.5,11,24.5,24.5,24.5h78.7
			c13.5,0,24.5-11,24.5-24.5V38.9c0-13.5-11-24.5-24.5-24.5C117.6,14.4,38.9,14.4,38.9,14.4z"
              />
            </g>
          </g>
          <g>
            <path d="M112.7,128.1H43.8c-3.9,0-7.1-3.2-7.1-7.1s3.2-7.1,7.1-7.1h68.8c3.9,0,7.1,3.2,7.1,7.1S116.6,128.1,112.7,128.1z" />
          </g>
        </svg>
        <span>Скачать ПДФ</span>
      </div>
      <div className={styles.button} onClick={() => handleDownloadPDF()}>
        <DownloadIcon className={styles.downloadIcon} />

        <span>Увеличить</span>
      </div>
    </div>
  );
}
