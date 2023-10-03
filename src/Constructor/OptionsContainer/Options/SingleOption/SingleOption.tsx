import { useContext, useState, useEffect } from "react";
import classNames from "classnames";
import { CheckboxIcon } from "../../../../Icons";
import { canvasOptionsContext } from "../../../../context/canvasOptionsContext";
import { canvasModeContext } from "../../../../context/canvasModeContext";
import Tippy from "@tippyjs/react";
import "tippy.js/animations/scale.css";
import { OptionNames, ModeNames } from "../../../../types/namesList";
import styles from "./singleoption.module.css";

interface ISingleOptionProps {
  name: string;
  price: number;
  priceExtra: number;
  correction: number;
  extraCorrection: number;
  checked: boolean;
  indexKey: number;
  isPricePerMeter: boolean;
  dataText: string;
  excluded: boolean;
  handleFlip: () => void;
}

interface IOptionTooltipContentProps {
  content: string;
}

type ExtraOptionT = {
  name: string;
  price: number;
  correction: number;
};

export function SingleOption(props: ISingleOptionProps) {
  const {
    name,
    price,
    priceExtra,
    correction,
    extraCorrection,
    checked,
    indexKey,
    isPricePerMeter,
    dataText,
    excluded,
    handleFlip,
  } = props;

  const { options, setOptions } = useContext(canvasOptionsContext);
  const { mode, setMode, isSeamless, setIsSeamless, setIsSigned } =
    useContext(canvasModeContext);
  const [isChecked, setIsChecked] = useState(checked);
  const [optionPrice, setOptionPrice] = useState(price);
  const [checkedExtraOption, setCheckedExtraOption] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);

  const extraOptions: ExtraOptionT[] = [
    { name: "A4", price: price, correction: correction },
    { name: "55x45 см", price: priceExtra, correction: extraCorrection },
  ];

  useEffect(() => {
    if (options && !isSeamless && name === OptionNames.Varnish) {
      setIsDisabled(true);
      setIsChecked(false);
      options.items[indexKey].isSet = false;
    } else setIsDisabled(false);
  }, [isSeamless]);

  useEffect(() => {
    if (options) {
      options.items[indexKey].priceCorrection = correction;
      options.items[indexKey].priceExtraCorrection = extraCorrection;
    }

    if (options && name === OptionNames.Install) {
      setOptionPrice(price + correction);
    }

    if (options && name === OptionNames.Example) {
      setOptionPrice(
        Math.min(price + correction, priceExtra + extraCorrection),
      );

      if (options.items[indexKey].isExtraPrice) setCheckedExtraOption(1);
    }

    if (options && name === OptionNames.Examples) {
      setOptionPrice(price + correction);
    }
  }, [correction, extraCorrection]);

  useEffect(() => {
    if (
      options &&
      name === OptionNames.StandartSizes &&
      mode === ModeNames.Handmode
    ) {
      setIsChecked(true);
      options.items[indexKey].isSet = true;
    }

    if (options && excluded) {
      if (name === OptionNames.Seamless) {
        setIsSeamless(false);
      }

      if (name === OptionNames.StandartSizes) setMode(ModeNames.Handmode);

      if (name === OptionNames.Signature) setIsSigned(false);

      setIsChecked(false);

      options.items[indexKey].isSet = false;
      options.items[indexKey].isHidden = true;
    } else if (options && !excluded) options.items[indexKey].isHidden = false;
  }, [excluded]);

  const handleClick = () => {
    if (options && !excluded && !isDisabled) {
      if (name === OptionNames.Seamless) {
        setIsSeamless(!isChecked ? true : false);
      }
      if (name === OptionNames.Flipped) {
        handleFlip();
      }

      if (name === OptionNames.StandartSizes)
        setMode(!isChecked ? ModeNames.Handmode : ModeNames.Panels);

      if (name === OptionNames.Signature)
        setIsSigned(!isChecked ? true : false);

      if (name === OptionNames.Example && isChecked) {
        setCheckedExtraOption(0);
        options.items[indexKey].isExtraPrice = false;
      }

      setIsChecked(!isChecked);

      options.items[indexKey].isSet = !isChecked;
      options.items[indexKey].priceCorrection = correction;
      options.items[indexKey].priceExtraCorrection = extraCorrection;

      setOptions({
        items: options.items,
      });
    }
  };

  const handleExtraOptionClick = (index: number, price: number) => {
    if (options && name === OptionNames.Example) {
      setCheckedExtraOption(index);

      if (price === priceExtra) options.items[indexKey].isExtraPrice = true;
      else options.items[indexKey].isExtraPrice = false;

      setOptions({
        items: options.items,
      });
    }
  };

  return (
    <>
      <Tippy
        className={styles.info}
        content={<OptionTooltipContent content={dataText} />}
        interactive={true}
        interactiveBorder={20}
        delay={100}
        duration={100}
        animation={"scale"}
        allowHTML={true}
        disabled={!isDisabled}
      >
        <div
          className={classNames(
            styles.container,
            "row",
            isDisabled && styles.disabled,
          )}
        >
          <div className="row">
            <div className={styles.iconContainer} onClick={handleClick}>
              <CheckboxIcon checked={isChecked} />
            </div>
            <div className="row">
              <div
                className={classNames(
                  styles.nameContainer,
                  isChecked ? "js-selected-option" : "",
                  excluded ? "js-hidden-option" : "",
                )}
              >
                {name}
              </div>
              <Tippy
                className={styles.info}
                content={<OptionTooltipContent content={dataText} />}
                interactive={true}
                interactiveBorder={20}
                delay={100}
                duration={100}
                animation={"scale"}
                allowHTML={true}
                disabled={isDisabled}
              >
                <div className={styles.tooltipIco}>(?)</div>
              </Tippy>
            </div>
          </div>
          <div className={styles.priceContainer}>
            {options && name === OptionNames.Example ? "от " : ""}
            {optionPrice} {isPricePerMeter ? "р./м2" : "р."}
          </div>
        </div>
      </Tippy>
      {options && name === OptionNames.Example && isChecked && (
        <div className={styles.extraOptions}>
          {extraOptions.map((option, index) => (
            <div key={index} className={`${styles.extraContainer} row`}>
              <div className="row">
                <div
                  className={classNames(
                    styles.iconContainer,
                    styles.iconContainerSmall,
                  )}
                  onClick={() => handleExtraOptionClick(index, option.price)}
                >
                  <div
                    className={classNames(
                      styles.checkmark,
                      checkedExtraOption === index && styles.checkmarkChecked,
                    )}
                  />
                </div>
                <div className={styles.nameContainer}>{option.name}</div>
              </div>
              <div className={styles.priceContainer}>
                {option.price + option.correction}{" "}
                {isPricePerMeter ? "р./м2" : "р."}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

const OptionTooltipContent = ({ content }: IOptionTooltipContentProps) => {
  return (
    <div
      className={styles.tooltipContent}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};
