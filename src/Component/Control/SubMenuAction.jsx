import { Button, Menu } from "@mantine/core";
import { LuChevronDown } from "react-icons/lu";

const SubMenuAction = ({ actionList,labelBtn }) => {
  return (
    <Menu
      offset={5}
      width={200}
      shadow="md"
      position="bottom-end"
      withArrow
      arrowPosition="center"
    >
      <Menu.Target>
        <Button
          rightSection={<LuChevronDown />}
          className="bg-PRIMARY_BUTTON hover:bg-BREAD_CRUMB text-white w-30 h-10 p-2"
        >
          {labelBtn}
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        {actionList.map((action, index) => (
          action.hide == false?<>
            <Menu.Item
              key={index}
              leftSection={action.icon}
              component="button"
              onClick={action.onClick}
              className="hover:bg-gray-100"
              disabled={action.disabled}
              rightSection={action.rightTxt}
            >
              {action.label}
            </Menu.Item>
            {action.endSection && <Menu.Divider />}
          </>:undefined
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};

export default SubMenuAction;
