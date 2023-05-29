import { SaveButton, Toolbar, ToolbarClasses } from 'react-admin';

export const SaveToolbar = () => {
    return (
        <Toolbar>
            <div className={ToolbarClasses.defaultToolbar}>
                <SaveButton />
            </div>
        </Toolbar>
    );
};
