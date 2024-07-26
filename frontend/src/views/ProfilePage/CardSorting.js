import Select from "react-select";
import "./Common.css";

const options = [
  { value: "defaultOption", label: "전체" },
  { value: "동행", label: "동행" },
  { value: "펀딩", label: "펀딩" },
  { value: "대기중", label: "대기중" },
  { value: "진행중", label: "진행중" },
  { value: "종료", label: "종료" },
];

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    borderRadius: "4px",
    fontSize: "14px",
    color: "#333",
    cursor: "pointer",
    boxShadow: state.isFocused ? "0 0 5px rgba(0, 0, 0, 0.1)" : "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    "&:hover": {
      borderColor: "#40a9ff",
    },
    minHeight: "17px",
    width: "90px",
    zIndex: 999,
  }),
  option: (provided, state) => ({
    ...provided,
    color: "#333",
    cursor: "pointer",
    padding: "3px 15px",
    "&:hover": {
      backgroundColor: "#bae7ff",
    },
  }),
  singleValue: provided => ({
    ...provided,
    color: "#333",
  }),
  menu: provided => ({
    ...provided,
    marginTop: "0",
    borderRadius: "4px",
    border: "1px solid #ddd",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    zIndex: 999,
  }),
  menuList: provided => ({
    ...provided,
    padding: "0",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: provided => ({
    ...provided,
    color: "#333",
  }),
};

const CardSorting = ({ onChangeOptionHandler }) => {
  const handleChange = selectedOption => {
    onChangeOptionHandler({ target: { value: selectedOption.value } });
  };

  return (
    <Select
      options={options}
      styles={customStyles}
      defaultValue={options[0]}
      onChange={handleChange}
      isSearchable={false} // 검색 기능 비활성화
    />
  );
};

export default CardSorting;
