import React, { useReducer, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { validate } from "../../util/validators";

const inputReducer = (state, action) => {
    switch (action.type) {
        case "CHANGE":
            return {
                ...state,
                value: action.val,
                isValid: validate(action.val, action.validators)
            };
        case "TOUCH": {
            return {
                ...state,
                isTouched: true
            };
        }
        default:
            return state;
    }
};

const Input = props => {
    const [inputState, dispatch] = useReducer(inputReducer, {
        value: props.initialValue || "",
        isTouched: false,
        isValid: props.initialValid || false
    });

    const { id, onInput } = props;
    const { value, isValid } = inputState;

    useEffect(() => {
        onInput(id, value, isValid);
    }, [id, value, isValid, onInput]);

    const changeHandler = event => {
        dispatch({
            type: "CHANGE",
            val: event.target.value,
            validators: props.validators
        });
    };

    const touchHandler = () => {
        dispatch({
            type: "TOUCH"
        });
    };

    let element = "";
    if (props.element === "input") {
        element = (
            <TextField
                error={!inputState.isValid && inputState.isTouched}
                id={props.id}
                type={props.type}
                label={props.label}
                variant={props.variant}
                margin={props.margin}
                fullWidth={props.fullWidth}
                required={props.required}
                color={props.color}
                className={props.className}
                placeholder={props.placeholder}
                onChange={changeHandler}
                onBlur={touchHandler}
                value={inputState.value}
                helperText={!inputState.isValid && inputState.isTouched && props.errorText}
            />
        );
    } else if (props.element === "select") {
        let options = [];
        options.push(
            <MenuItem key="1" value="">
                Please select...
            </MenuItem>
        );
        props.data.map(item => {
            return options.push(
                <MenuItem key={item.id} value={item.id}>
                    {item.name}
                </MenuItem>
            );
        });
        element = (
            <Select
                id={props.id}
                variant={props.variant}
                margin={props.margin}
                fullWidth={props.fullWidth}
                required={props.required}
                color={props.color}
                className={props.className}
                value={inputState.value}
                onChange={changeHandler}
                onBlur={touchHandler}
            >
                {options}
            </Select>
        );
    } else {
        element = <textarea id={props.id} rows={props.rows || 3} onChange={changeHandler} onBlur={touchHandler} value={inputState.value} />;
    }

    return <React.Fragment>{element}</React.Fragment>;
};

export default Input;
