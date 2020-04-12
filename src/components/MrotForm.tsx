import React, { ReactElement, useState } from "react";
import styled from "styled-components";
import { Radio, Popover, Switch, InputNumber } from "antd";
import { Field, FieldAttributes, Formik, FormikProps } from "formik";
import { RadioProps } from "antd/lib/radio";
import { InputProps } from "antd/lib/input";
import {
  ExclamationCircleOutlined,
  CloseCircleOutlined
} from "@ant-design/icons";
import { FormProps } from "antd/lib/form";
import { RadioChangeEventTarget } from "antd/es/radio";

const FormWrapper = styled.div`
  width: 350px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  justify-content: center;
  align-items: flex-start;
`;

const RadioGroup = styled(Radio.Group)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding-left: 15px;
  margin-bottom: 10px;
  *::after {
    background-color: black;
  }
`;

const StyledRadio = styled(Radio)<{ active: boolean }>`
  * {
    border-color: ${props => (props.active ? "black" : "lightgray")}!important;
  }
`;

const StyledSwitch = styled(Switch)`
  min-width: 32px;
  margin: 0 5px;
  background-color: ${props => (props.checked ? "orange" : "lightgray")};
`;

const Text = styled.div`
  color: lightgray;
  justify-self: flex-start;
  align-self: flex-start;
`;

const NdflDiv = styled.div`
  display: inline;
  font-size: 10px;
  padding-left: 43px;
  font-weight: bold;
`;

const StyledSpan = styled.span`
  color: ${({ defaultChecked }) => (defaultChecked ? "black" : "lightgray")};
`;

const StyledInput = styled(InputNumber)`
  border-radius: 15px;
  width: 145px;
  * {
    font-weight: bold;
  }
  margin-bottom: 10px;
  .ant-input-number-handler-wrap {
    display: none;
  }
`;

const Plashka = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fbf4da;
  padding: 20px;
  p {
    span {
      font-weight: bold;
    }
  }
`;

const FormikRadioGroup: React.FC<RadioProps & FieldAttributes<any>> = ({
  children,
  value,
  onChange
}) => (
  <Field as={RadioGroup} value={value} onChange={onChange}>
    {children}
  </Field>
);

interface RadioProp {
  icon:
    | {
        text: string;
        first: () => ReactElement;
        second: () => ReactElement;
      }
    | undefined;
  choosenRadio: string;
}

const FormikRadio: React.FC<RadioProps &
  FieldAttributes<{
    setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean
    ) => void;
  }> &
  RadioProp> = ({ value, onChange, id, setFieldValue, ...props }) => {
  const [changeIcon, setChangeIcon] = useState(true);
  let content;
  if (props.icon) {
    content = (
      <div>
        <p>{props.icon.text}</p>
      </div>
    );
  }

  return (
    <div>
      <Field
        as={StyledRadio}
        value={value}
        id={id}
        active={value === props.choosenRadio}
      >
        {value}
      </Field>
      {props.icon && (
        <Popover
          placement="bottomLeft"
          content={content}
          trigger="click"
          overlayClassName={"PopOver"}
          onVisibleChange={() => setChangeIcon(!changeIcon)}
        >
          {changeIcon ? props.icon.first() : props.icon.second()}
        </Popover>
      )}
    </div>
  );
};

interface InputProp {
  symbol: string;
  oplata: string;
}

const FormikInput: React.FC<InputProps &
  FormProps &
  FieldAttributes<FormikProps<{}> & InputProp>> = ({
  setFieldValue,
  value,
  symbol,
  oplata
}) => (
  <div
    style={{
      textAlign: "center",
      display: "block",
      marginTop: "10px",
      paddingLeft: "43px"
    }}
  >
    <StyledInput
      value={value.toLocaleString()}
      formatter={value => Number(value!).toLocaleString()}
      onChange={value => {
        setFieldValue("inputR", value!.toString());
      }}
    />

    <span style={{ fontWeight: "bold", marginLeft: "5px" }}>
      {symbol} {oplata === "Оплата за день" && "в день"}
      {oplata === "Оплата за час" && "в час"}
    </span>
  </div>
);

function toNumber(
  str: string,
  ndflChecked: boolean = true,
  n?: number | string
): string {
  str = str.replace(/[^\d]/g, "");
  if (typeof n === "string") {
    n = n.replace(/[^\d]/g, "");
    return ndflChecked
      ? (Number(str) + Number(n)).toLocaleString()
      : Number(
          (Number(str) * (1 - 0.13) + Number(n)).toFixed(0)
        ).toLocaleString();
  }
  if (typeof n === "number") {
    return !ndflChecked
      ? Number(
          (Number(str) * 0.13).toFixed(0).replace(/\s/g, "")
        ).toLocaleString()
      : Number(
          ((Number(str) * 0.13) / 0.87).toFixed(0).replace(/\s/g, "")
        ).toLocaleString();
  }
  return ndflChecked
    ? Number(str).toLocaleString()
    : Number((Number(str) * (1 - 0.13)).toFixed(0)).toLocaleString();
}

const MrotForm: React.FC = () => {
  return (
    <FormWrapper>
      <Formik
        initialValues={{
          choosenRadio: "Оклад за месяц",
          ndflChecked: true,
          inputR: "40000",
          symbol: "₽",
          RadioGroup: [
            { id: "1", value: "Оклад за месяц" },
            {
              id: "2",
              value: "МРОТ",
              icon: {
                first: () => (
                  <ExclamationCircleOutlined style={{ height: 5 }} />
                ),
                second: () => <CloseCircleOutlined style={{ height: 5 }} />,
                text:
                  "МРОТ - минимальный размер оплаты труда. Разный для разных регионов."
              }
            },
            { id: "3", value: "Оплата за день" },
            { id: "4", value: "Оплата за час" }
          ]
        }}
        onSubmit={data => {
          console.log(data);
        }}
      >
        {({ values, handleSubmit, setFieldValue }) => (
          <form onSubmit={handleSubmit}>
            <>
              <Text>Cумма</Text>
              <FormikRadioGroup
                value={values.choosenRadio}
                onChange={({ target }: { target: RadioChangeEventTarget }) => {
                  setFieldValue("choosenRadio", target.value);
                }}
              >
                {values.RadioGroup.map(({ id, value, icon }) => {
                  return (
                    <FormikRadio
                      id={id}
                      value={value}
                      key={Math.random()}
                      icon={icon}
                      name={id}
                      setFieldValue={setFieldValue}
                      choosenRadio={values.choosenRadio}
                    >
                      {value}
                    </FormikRadio>
                  );
                })}
              </FormikRadioGroup>
              {values.choosenRadio !== "МРОТ" && (
                <>
                  <NdflDiv>
                    <StyledSpan defaultChecked={!values.ndflChecked}>
                      Указать с НДФЛ
                    </StyledSpan>
                    <Field
                      as={StyledSwitch}
                      checked={values.ndflChecked}
                      id="switch"
                      onChange={() => {
                        setFieldValue("ndflChecked", !values.ndflChecked);
                      }}
                    />
                    <StyledSpan defaultChecked={values.ndflChecked}>
                      Без НДФЛ
                    </StyledSpan>
                  </NdflDiv>
                  <div style={{ display: "block" }}>
                    <Field
                      as={FormikInput}
                      value={values.inputR}
                      setFieldValue={setFieldValue}
                      name="inputR"
                      symbol={values.symbol}
                      oplata={values.choosenRadio}
                    />
                  </div>
                </>
              )}
              {values.choosenRadio === "Оклад за месяц" && (
                <Plashka>
                  <p>
                    <span>
                      {toNumber(values.inputR, values.ndflChecked)}{" "}
                      {values.symbol}{" "}
                    </span>
                    сотрудник будет получать на руки
                  </p>
                  <p>
                    <span>
                      {toNumber(values.inputR, values.ndflChecked, 1)}{" "}
                      {values.symbol}{" "}
                    </span>
                    НДФЛ, 13% от оклада
                  </p>
                  <p>
                    <span>
                      {toNumber(
                        values.inputR,
                        values.ndflChecked,
                        toNumber(values.inputR, values.ndflChecked, 1)
                      ).toLocaleString()}{" "}
                      {values.symbol}
                    </span>{" "}
                    за сотрудника в месяц
                  </p>
                </Plashka>
              )}
            </>
          </form>
        )}
      </Formik>
    </FormWrapper>
  );
};

export default MrotForm;
