import { useCallback } from 'react';

import { changeCompose } from '../../../actions/compose';

import { useIntl, defineMessages } from 'react-intl';

import MeetingRoomIcon from '@/material-icons/400-24px/meeting_room.svg?react';
import { IconButton } from '../../../components/icon_button';
import { useAppSelector, useAppDispatch } from 'flavours/glitch/store';

const messages = defineMessages({
    create_link: { id: 'jitsi_meeting_button.create_link', defaultMessage: 'Generate a Jitsi video call link' },
});

export const JitsiMeetingButton = () => {
    const intl = useIntl();

    const isEditing = useAppSelector((state) => state.getIn(['compose', 'id']) !== null);
    const active = useAppSelector((state) => state.getIn(['compose', 'jitsi_meeting']));

    const dispatch = useAppDispatch();

    const handleClick = useCallback(() => {
        var x = Math.floor((Math.random() * 10000000000000000) + 1);
        dispatch(changeCompose("https://meet.jit.si/"+x));
    }, [active, dispatch]);

    const title = intl.formatMessage(messages.create_link);

    return (
        <IconButton
            disabled={isEditing}
            icon=''
            onClick={handleClick}
            iconComponent={MeetingRoomIcon}
            title={title}
            active={active}
            size={18}
            inverted
        />
    )
}