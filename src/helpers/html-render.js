import { Liquid } from 'liquidjs'
const engine = new Liquid()

export default {
    render: async ({ data, template }) => {
        return await engine.parseAndRender(template, data || {})
    },
}
