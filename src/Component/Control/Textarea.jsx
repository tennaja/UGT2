import React from 'react';


const Textarea  = (props) => {
    const { register, label, error,disabled, id, ...inputProps } = props
    return (
        <>
            {label ? (<label className='mb-1' htmlFor={id}><b>{label}</b></label>):(<></>)}
            <textarea
                id={id}
                // rows="3.5"
                {...inputProps}
                disabled={disabled ? true  : false}
                className={`${error ? 'h-[120px] border-1 border-rose-500 rounded block w-full bg-transparent outline-none py-2 px-3'
                    :
                    'h-[120px] focus:ring-1 ring-inset focus:ring-[#2563eb] border-1 border-gray-300 rounded block w-full bg-transparent outline-none py-4 px-3'}`
                }
            />
            {error && (
                <p className="mt-1 mb-1 text-red-500 text-xs text-left">
                    {error.message}
                </p>
            )}

        </>
    );
};

export default Textarea;