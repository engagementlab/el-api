
/** @jsx jsx */
import { jsx } from '@emotion/core';

export default function NameCell({ field, data }) {
    const id = !data ? 'null' : `${data.first}-${data.last}`;
    const label = !data.first ? 'None! :(' : `${data.last}, ${data.first}`;

    return <p key={`namecell-${id}`}>{label}</p>
}