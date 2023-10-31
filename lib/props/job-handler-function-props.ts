export interface JobHandlerFunctionProps {
  handlerFunctionName: string;
  handlerFileLocation: string;
  environment: { [key: string]: string };
}
