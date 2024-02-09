import { FC, ReactNode, useCallback, useMemo, useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from '@nextui-org/react';
import { UseDisclosureReturn } from '@nextui-org/use-disclosure';

interface ConfirmationModalProps {
  children?: ReactNode;
}

interface UseDisclosureProps {
  isOpen: UseDisclosureReturn['isOpen'];
  onClose: UseDisclosureReturn['onClose'];
  onConfirm: () => void;
  onOpenChange: UseDisclosureReturn['onOpenChange'];
}

export const ConfirmationModal: FC<ConfirmationModalProps & UseDisclosureProps> = ({
  children,
  onConfirm,
  isOpen,
  onOpenChange,
  onClose,
}) => {
  const handleConfirmation = useCallback(() => {
    onConfirm();
    onClose();
  }, [onConfirm, onClose]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xs">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
            <ModalBody>{children}</ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={handleConfirmation}>
                Yes
              </Button>
              <Button color="primary" onPress={onClose}>
                No
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export const useConfirmationModal = () => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [onConfirmCallBack, setOnConfirmCallback] = useState(() => () => {});

  const ConfirmationModalWithDisclosure: FC<ConfirmationModalProps> = useCallback(
    (props) => (
      <ConfirmationModal
        {...props}
        onConfirm={onConfirmCallBack}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
      />
    ),
    [isOpen, onOpenChange, onClose, onConfirmCallBack],
  );
  const openModal = useCallback(
    (onConfirm: () => void) => {
      setOnConfirmCallback(() => onConfirm);
      onOpen();
    },
    [onOpen],
  );

  return { ConfirmationModal: ConfirmationModalWithDisclosure, openModal };
};
