import tracer from 'dd-trace';
import { env } from './shared/utils/env.js'

if (env.DD_TRACER_ACTIVATER){
    tracer.init()
}

export default tracer;