import { Box, Button } from "@chakra-ui/react"
import { useState } from "react";

function App() {
  const direction = [
    'to-t',
    'to-tr',
    'to-r',
    'to-br',
    'to-b',
    'to-bl',
    'to-l',
    'to-tl',
  ]
  const [index, setIndex] = useState(0)

  const rotateGradient = () => {
    console.log('linear('+direction[index]+', red.100, blue.300)');
    if (index == direction.length - 1) setIndex(0);

    setIndex((previous) => previous + 1);
  };
  
  return (
      <Box
      w="100%"
      h="100vh"
      bgGradient={'linear('+direction[index]+', red.100, blue.300)'}
      >
        <Button
        left="50%"
        top="50%"
        colorScheme="teal"
        onClick={() => rotateGradient()}
        >
        Click me!
        </Button>
      </Box>
  )
}

export default App