import {defineConfig, globalIgnores} from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'

const eslintConfig = defineConfig([
    ...nextVitals,
    {
        rules: {
            // the following two rules are new in eslint-plugin-react-hooks 6 (pulled in by
            // eslint-config-next 16) and were not part of this project's original lint contract.
            // they flag working patterns whose safe rewrite would require redesigning intricate
            // effect/state logic — left off to preserve parity, tracked as follow-ups:
            //  - immutability: the edit page mutates the user object then re-sets it via
            //    Object.assign; its add-movie flow relies on `top` and `user.top` sharing an array ref.
            //  - set-state-in-effect: effects set loading/search flags synchronously.
            'react-hooks/immutability': 'off',
            'react-hooks/set-state-in-effect': 'off',
        },
    },
    globalIgnores([
        '.next/**',
        'out/**',
        'build/**',
        'next-env.d.ts',
    ]),
])

export default eslintConfig
