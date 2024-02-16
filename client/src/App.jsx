import { Box, Button } from "@chakra-ui/react"

function App() {
  const [direction, setDirection] = React.useState([
    'to-t',
    'to-tr',
    'to-r',
    'to-br',
    'to-b',
    'to-bl',
    'to-l',
    'to-tl',
  ])
  const [index, setIndex] = React.useState(0)

  const rotateGradient = () => {
    if (index == direction.length - 1) setIndex(0);

    setIndex((previous) => previous + 1);
  };
  
  return (
      <Box
      w="50%"
      h="300px"
      bgGradient={'linear (' + direction[index] + ', red.100, blue.300'}
      >
        <Button
        left="20%"
        top="20%"
        bgGradient={'linear (' + direction[index] + ', red.100, blue.300'}
        onClick={() => rotateGradient()}
        >
        Click me!
        </Button>
      </Box>
  )
}

export default App
