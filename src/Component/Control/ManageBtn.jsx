import { Button, Menu } from "@mantine/core";
import { LuChevronDown } from "react-icons/lu";

const ManageBtn = ({ actionList }) => {
  return (
    <Menu
      offset={5}
      width={180}
      shadow="md"
      position="bottom-end"
      withArrow
      arrowPosition="center"
    >
      <Menu.Target>
        <Button
          rightSection={<LuChevronDown />}
          className="bg-PRIMARY_BUTTON hover:bg-BREAD_CRUMB text-white w-30"
        >
          Manage
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        {actionList.map((action, index) => (
          <>
            <Menu.Item
              key={index}
              leftSection={action.icon}
              component="button"
              onClick={action.onClick}
              className="hover:bg-gray-100"
              disabled={action.disabled}
            >
              {action.label}
            </Menu.Item>
            {action.endSection && <Menu.Divider />}
          </>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};

export default ManageBtn;
