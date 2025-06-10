// SPDX-License-Identifier: Apache-2.0
import { SaveButton, Toolbar, ToolbarProps } from 'react-admin';

export const ViewToolbar = (props: ToolbarProps) => {
    const { children = <SaveButton /> } = props;

    return <Toolbar children={children} />;
};
