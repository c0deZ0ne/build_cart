import { RiCheckboxBlankFill } from "react-icons/ri";

function CustomCheckBoxIcon(props) {
  const { isIndeterminate, isChecked, ...rest } = props;

  return (
    <>
      {!isChecked ? null : <RiCheckboxBlankFill color={"#12355A"} {...rest} />}
    </>
  );
}

export default CustomCheckBoxIcon;
