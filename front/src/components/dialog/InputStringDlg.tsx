import { FormControl, Input } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { FC, useRef, useState } from "react";

const useDialogStyles = makeStyles((theme) =>
    createStyles({
        root: {
            minWidth: '320px'
        }
    })
);

export const InputStringDlg: FC<{
    visible: boolean,
    title?: string,
    value?: string,
    onSet: (value: string | undefined) => void,
    onCancel: () => void
}> = (props) => {

    const classes = useDialogStyles();

    const inputRef = useRef<HTMLInputElement>();

    const setHandler = () => {
        if (inputRef.current) {
            props.onSet(inputRef.current.value);
        }
    }

    return (
        <Dialog
            fullWidth={true}
            maxWidth="sm"
            open={props.visible}
            classes={classes}
            onClose={props.onCancel}
        >
            <DialogTitle disableTypography={true} style={{ paddingBottom: 0 }}>
                <Typography variant="h5">{props.title ? props.title : 'Введите значение'}</Typography>
            </DialogTitle>

            <DialogContent>
                <FormControl fullWidth>
                    <Input inputRef={inputRef} defaultValue={props.value} autoFocus onKeyUp={(e) => {
                        if (e.key === 'Enter') setHandler();
                    }} />
                </FormControl>
            </DialogContent>

            <DialogActions style={{ marginTop: 16 }}>
                <Button onClick={setHandler} variant="contained">ОК</Button>
                <Button onClick={props.onCancel} variant="contained">Отмена</Button>
            </DialogActions>
        </Dialog >
    );
};
